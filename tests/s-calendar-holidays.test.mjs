import assert from "node:assert/strict";
import test from "node:test";
import { canonicalPayload, convertHolidayCn, readPublished, validateSchedule } from "../tools/s-calendar-holidays.mjs";

const fullYear = Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`2027-10-${String(i + 1).padStart(2, "0")}`, "休"]));

test("published file is signed with the app's public key", () => {
  const { schedule } = readPublished();
  assert.deepEqual(validateSchedule(schedule), []);
});

test("unpublished holiday-cn years are ignored", () => {
  assert.equal(convertHolidayCn(2027, { year: 2027, papers: [], days: [] }), null);
  assert.equal(convertHolidayCn(2027, null), null);
});

test("holiday-cn days convert to 休 / 班", () => {
  const days = convertHolidayCn(2027, {
    year: 2027,
    papers: ["https://www.gov.cn/example"],
    days: [{ name: "元旦", date: "2027-01-01", isOffDay: true }, { name: "春节", date: "2027-02-06", isOffDay: false }],
  });
  assert.deepEqual(days, { "2027-01-01": "休", "2027-02-06": "班" });
});

test("entries outside the year are rejected", () => {
  assert.throws(() => convertHolidayCn(2027, { year: 2027, papers: ["x"], days: [{ date: "2028-01-01", isOffDay: true }] }));
});

test("incomplete or malformed schedules fail validation", () => {
  assert.notDeepEqual(validateSchedule({ schemaVersion: 1, publishedYears: [2027], days: { "2027-01-01": "休" } }), []);
  assert.notDeepEqual(validateSchedule({ schemaVersion: 1, publishedYears: [2027], days: { ...fullYear, "2027-02-30": "休" } }), []);
  assert.notDeepEqual(validateSchedule({ schemaVersion: 1, publishedYears: [2027], days: { ...fullYear, "2028-01-01": "休" } }), []);
  assert.notDeepEqual(validateSchedule({ schemaVersion: 1, publishedYears: [2027], days: { ...fullYear, "2027-01-01": "假" } }), []);
  assert.deepEqual(validateSchedule({ schemaVersion: 1, publishedYears: [2027], days: fullYear }), []);
});

test("canonical payload does not depend on key order", () => {
  const a = canonicalPayload({ schemaVersion: 1, publishedYears: [2027, 2026], days: { "2027-01-02": "休", "2026-01-01": "班" } });
  const b = canonicalPayload({ schemaVersion: 1, publishedYears: [2026, 2027], days: { "2026-01-01": "班", "2027-01-02": "休" } });
  assert(a.equals(b));
});
