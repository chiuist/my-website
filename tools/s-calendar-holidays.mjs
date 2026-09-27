#!/usr/bin/env node
// 日历即日历（Simply Calendar）法定节假日数据：同步、签名与校验。
//
//   node tools/s-calendar-holidays.mjs sync           从 holiday-cn 同步国务院放假安排（CI 每天运行）
//   node tools/s-calendar-holidays.mjs sign <file>    手动签名一份完整安排（紧急修正 / holiday-cn 不可用时）
//   node tools/s-calendar-holidays.mjs verify         用 App 内置公钥校验已发布文件
//
// 输出 s-calendar/data/holidays.json：{"payload": base64(JSON), "signature": base64(Ed25519)}。
// App 用 PUBLIC_KEY 校验签名；私钥只存在于 GitHub Secret HOLIDAY_SIGNING_KEY 与发布者的钥匙串，
// 格式为 base64 编码的 32 字节 Ed25519 种子。

import { createPrivateKey, createPublicKey, sign, verify } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// 与 App 中 HolidayStore.publicKey 相同。
export const PUBLIC_KEY = "ehe3sjn+AcOX7hyVLj320M1oikJOSzQvKYgaZF4XSCY=";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const OUTPUT = resolve(root, "s-calendar/data/holidays.json");
const SOURCES = [
  year => `https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/${year}.json`,
  year => `https://cdn.jsdelivr.net/gh/NateScarlet/holiday-cn@master/${year}.json`,
];
const MIN_OFF_DAYS = 20;
const MAX_DAYS_PER_YEAR = 60;

const PKCS8_PREFIX = Buffer.from("302e020100300506032b657004220420", "hex");
const SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");

function privateKeyFromEnv() {
  const seed = Buffer.from((process.env.HOLIDAY_SIGNING_KEY || "").trim(), "base64");
  if (seed.length !== 32) throw new Error("缺少或无效的 HOLIDAY_SIGNING_KEY（需要 base64 编码的 32 字节 Ed25519 种子）");
  const key = createPrivateKey({ key: Buffer.concat([PKCS8_PREFIX, seed]), format: "der", type: "pkcs8" });
  const derived = createPublicKey(key).export({ format: "der", type: "spki" }).subarray(12).toString("base64");
  if (derived !== PUBLIC_KEY) throw new Error("HOLIDAY_SIGNING_KEY 与 App 内置公钥不匹配");
  return key;
}

function publicKey() {
  return createPublicKey({ key: Buffer.concat([SPKI_PREFIX, Buffer.from(PUBLIC_KEY, "base64")]), format: "der", type: "spki" });
}

function isValidDate(key) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const date = new Date(`${key}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === key;
}

/** 与 App 端 HolidaySchedule.validated() 相同的规则，外加每年的合理性检查。 */
export function validateSchedule(schedule) {
  const errors = [];
  if (schedule.schemaVersion !== 1) errors.push("schemaVersion 必须为 1");
  const years = schedule.publishedYears;
  if (!Array.isArray(years) || years.length === 0 || !years.every(y => Number.isInteger(y) && y >= 2000 && y <= 2100)) {
    errors.push("publishedYears 无效");
    return errors;
  }
  const perYear = new Map(years.map(y => [y, { off: 0, total: 0 }]));
  for (const [key, value] of Object.entries(schedule.days || {})) {
    if (!isValidDate(key)) { errors.push(`日期无效：${key}`); continue; }
    const stats = perYear.get(Number(key.slice(0, 4)));
    if (!stats) { errors.push(`${key} 的年份不在 publishedYears 中`); continue; }
    if (value !== "休" && value !== "班") errors.push(`${key} 的值只能是 休 或 班`);
    stats.total += 1;
    if (value === "休") stats.off += 1;
  }
  for (const [year, stats] of perYear) {
    if (stats.off < MIN_OFF_DAYS) errors.push(`${year} 年只有 ${stats.off} 天休息，少于 ${MIN_OFF_DAYS} 天，疑似数据不完整`);
    if (stats.total > MAX_DAYS_PER_YEAR) errors.push(`${year} 年有 ${stats.total} 条记录，超过 ${MAX_DAYS_PER_YEAR} 条`);
  }
  return errors;
}

/** 规范化后的 payload 字节：相同内容总是得到相同字节，便于判断是否变化。 */
export function canonicalPayload(schedule) {
  const days = Object.fromEntries(Object.entries(schedule.days).sort(([a], [b]) => a.localeCompare(b)));
  const publishedYears = [...new Set(schedule.publishedYears)].sort((a, b) => a - b);
  return Buffer.from(JSON.stringify({ schemaVersion: 1, publishedYears, days }), "utf8");
}

export function readPublished(path = OUTPUT) {
  const envelope = JSON.parse(readFileSync(path, "utf8"));
  const payload = Buffer.from(envelope.payload, "base64");
  const signature = Buffer.from(envelope.signature, "base64");
  if (!verify(null, payload, publicKey(), signature)) throw new Error("已发布文件签名无效");
  const schedule = JSON.parse(payload.toString("utf8"));
  const errors = validateSchedule(schedule);
  if (errors.length) throw new Error(`已发布文件内容无效：${errors.join("；")}`);
  return { schedule, payload };
}

function writeSigned(schedule, path = OUTPUT) {
  const errors = validateSchedule(schedule);
  if (errors.length) throw new Error(`数据未通过检查：${errors.join("；")}`);
  const payload = canonicalPayload(schedule);
  const signature = sign(null, payload, privateKeyFromEnv());
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify({ payload: payload.toString("base64"), signature: signature.toString("base64") }) + "\n");
  return payload;
}

async function fetchYear(year) {
  for (const source of SOURCES) {
    const url = source(year);
    try {
      const response = await fetch(url, { headers: { "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(20_000) });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn(`读取 ${url} 失败：${error.message}`);
    }
  }
  throw new Error(`无法从任何数据源读取 ${year} 年安排`);
}

/** holiday-cn 的一年数据；尚未公布（空文件、无公告链接）时返回 null。 */
export function convertHolidayCn(year, data) {
  if (!data || data.year !== year || !Array.isArray(data.days) || data.days.length === 0) return null;
  if (!Array.isArray(data.papers) || data.papers.length === 0) return null;
  const days = {};
  for (const entry of data.days) {
    if (typeof entry.date !== "string" || !entry.date.startsWith(`${year}-`) || typeof entry.isOffDay !== "boolean") {
      throw new Error(`${year} 年数据格式异常：${JSON.stringify(entry)}`);
    }
    days[entry.date] = entry.isOffDay ? "休" : "班";
  }
  return days;
}

async function syncCommand() {
  // 先检查私钥：即使今天没有新数据，Secret 缺失或不匹配也要立刻失败并通知。
  privateKeyFromEnv();
  const { schedule: current, payload: currentPayload } = readPublished();
  const shanghaiYear = Number(new Intl.DateTimeFormat("en", { timeZone: "Asia/Shanghai", year: "numeric" }).format(new Date()));
  const next = {
    schemaVersion: 1,
    publishedYears: [...current.publishedYears],
    days: { ...current.days },
  };
  for (const year of [shanghaiYear - 1, shanghaiYear, shanghaiYear + 1]) {
    const days = convertHolidayCn(year, await fetchYear(year));
    if (!days) {
      console.log(`${year}：尚未公布，保持现状`);
      continue;
    }
    // 已发布的年份不会被删除；有新数据时整年替换（包括官方更正）。
    for (const key of Object.keys(next.days)) {
      if (key.startsWith(`${year}-`)) delete next.days[key];
    }
    Object.assign(next.days, days);
    if (!next.publishedYears.includes(year)) next.publishedYears.push(year);
    console.log(`${year}：${Object.keys(days).length} 条`);
  }
  if (canonicalPayload(next).equals(currentPayload)) {
    console.log("没有变化");
    return;
  }
  writeSigned(next);
  console.log(`已更新并签名：${OUTPUT}`);
}

function signCommand(file) {
  if (!file) throw new Error("用法：sign <holidays.json>");
  const schedule = JSON.parse(readFileSync(resolve(file), "utf8"));
  writeSigned(schedule);
  console.log(`已签名：${OUTPUT}`);
}

function verifyCommand() {
  const { schedule } = readPublished();
  console.log(`签名有效：年份 ${schedule.publishedYears.join("、")}，共 ${Object.keys(schedule.days).length} 条`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [command, argument] = process.argv.slice(2);
  try {
    if (command === "sync") await syncCommand();
    else if (command === "sign") signCommand(argument);
    else if (command === "verify") verifyCommand();
    else throw new Error("用法：sync | sign <file> | verify");
  } catch (error) {
    console.error(`错误：${error.message}`);
    process.exit(1);
  }
}
