// Optional local Cloudflare runtime: node tests/routes.integration.mjs https://127.0.0.1:8787
// Production: node tests/routes.integration.mjs
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import https from "node:https";

const product = "https://dropedge.chiuist.com";
const local = process.argv[2] ? new URL(process.argv[2]) : null;
if (local) assert.equal(local.hostname, "127.0.0.1", "TLS override is restricted to local testing");
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const repoFile = name => readFileSync(new URL("../" + name, import.meta.url));
const expectedDmg = "e5142bdcff328d49bda92298fece037277fdb9385696d07ea1457391436b56d6";

function assertHtml(actual, expected) {
  // Cloudflare Web Analytics can append this edge-managed beacon to HTML.
  // Ignore only that observed script; asset/DMG byte comparisons stay exact.
  const content = actual.toString().replace(/<script\b(?=[^>]*\bsrc="https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js(?:\/[^\"]*)?")(?=[^>]*\bdata-cf-beacon=)[^>]*><\/script>\n?/g, "");
  assert.equal(content, expected.toString());
}

function request(url, headers = {}, method = "GET") {
  const target = new URL(url);
  return new Promise((resolve, reject) => {
    const req = https.request(local || target, {
      method,
      path: target.pathname + target.search,
      headers: { Host: target.host, ...headers },
      rejectUnauthorized: !local,
      timeout: 30000,
    }, response => {
      const chunks = [];
      response.on("data", chunk => chunks.push(chunk));
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks) }));
      response.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("Request timed out: " + url)));
    req.end();
  });
}

async function follow(url, headers = {}) {
  for (let redirects = 0; redirects < 6; redirects++) {
    const response = await request(url, headers);
    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      url = new URL(response.headers.location, url).href;
      assert.equal(new URL(url).origin, product, "Redirect must stay on the product domain");
    } else return { ...response, url };
  }
  throw new Error("Redirect loop: " + url);
}

const home = await follow(product + "/");
assert.equal(home.status, 200);
assert.equal(home.url, product + "/");
assertHtml(home.body, repoFile("dropedge/en/index.html"));
assert.equal(home.headers["content-language"], "en");
assert.match(home.headers.vary, /accept-language/i);
const html = home.body.toString();
const href = html.match(/class="button primary" href="([^"]+)"/)[1];
const actualDownload = new URL(href, home.url).href;
assert.equal(actualDownload, product + "/downloads/DropEdge-Free-1.1.0-build8.dmg");
console.log("PASS homepage and actual download entry:", actualDownload);

for (const pathname of ["privacy", "support"]) {
  for (const suffix of ["", ".html", "/"]) {
    const response = await follow(product + "/" + pathname + suffix + "?ref=qa");
    assert.equal(response.status, 200);
    assert.equal(response.url, product + "/" + pathname + "?ref=qa");
    assertHtml(response.body, repoFile(`dropedge/en/${pathname}.html`));
    assert.equal(response.headers["content-language"], "en");
  }
  console.log("PASS legal page aliases and canonical redirect:", pathname);
}

for (const [acceptLanguage, language, directory] of [
  ["en-US,en;q=0.9", "en", "en/"],
  ["fr-FR,fr;q=0.9,zh;q=0.8", "en", "en/"],
  ["ja-JP,zh-CN;q=0.9", "en", "en/"],
  ["zh-CN,zh;q=0.9,en;q=0.8", "zh-CN", ""],
  ["zh-Hant-TW,zh;q=0.9", "zh-CN", ""],
]) {
  for (const [pathname, filename] of [["/", "index.html"], ["/privacy", "privacy.html"], ["/support", "support.html"]]) {
    const response = await follow(product + pathname + "?lang-test=1", { "Accept-Language": acceptLanguage });
    assert.equal(response.status, 200);
    assert.equal(response.headers["content-language"], language);
    assert.match(response.headers.vary, /accept-language/i);
    assertHtml(response.body, repoFile(`dropedge/${directory}${filename}`));
  }
  console.log("PASS browser language:", acceptLanguage, "=>", language);
}

for (const pathname of ["styles.css", "assets/og.png", "assets/app-icon.png"]) {
  const response = await request(product + "/" + pathname);
  assert.equal(response.status, 200);
  assert.equal(sha256(response.body), sha256(repoFile("dropedge/" + pathname)));
  console.log("PASS asset bytes:", pathname);
}

for (const pathname of ["downloads/DropEdge-Free-1.1.0-build8.dmg", "downloads/DropEdge-Latest.dmg", "downloads/DropEdge-Free-1.1.0.dmg"]) {
  const response = await request(product + "/" + pathname);
  assert.equal(response.status, 200);
  assert(!response.headers["content-type"].includes("html"));
  assert.equal(sha256(response.body), expectedDmg);
  const head = await request(product + "/" + pathname, {}, "HEAD");
  assert.equal(head.status, 200);
  assert.equal(head.body.length, 0);
  console.log("PASS DMG GET/HEAD:", pathname, sha256(response.body));
}

const partial = await request(actualDownload, { Range: "bytes=0-511" });
// The existing Cloudflare asset service may ignore Range and return the full
// file (200). Preserve that behavior; if it serves 206, validate the exact range.
assert([200, 206].includes(partial.status));
if (partial.status === 206) {
  assert.deepEqual(partial.body, repoFile("dropedge/downloads/DropEdge-Free-1.1.0-build8.dmg").subarray(0, 512));
} else {
  assert.equal(sha256(partial.body), expectedDmg);
}
console.log("PASS range request bytes (HTTP " + partial.status + ")");

const archived = await request(product + "/downloads/archive/DropEdge-Free-1.1.0-e9ad6214ec9d.dmg");
assert.equal(archived.status, 200);
assert.equal(sha256(archived.body), "e9ad6214ec9d3bdd46327d2a89fa2059063a59404c4dd5459938af5e5e0ebd26");
console.log("PASS rollback DMG");

for (const host of ["chiuist.com", "www.chiuist.com", "heyhong.net", "www.heyhong.net"]) {
  for (const pathname of ["", "/", "/privacy.html", "/support.html", "/assets/og.png", "/downloads/DropEdge-Latest.dmg"]) {
    const oldUrl = `https://${host}/dropedge${pathname}?ref=legacy`;
    const response = await request(oldUrl);
    assert.equal(response.status, 308, oldUrl);
    assert.equal(response.headers.location, product + (pathname || "/") + "?ref=legacy");
  }
  const root = await request(`https://${host}/`);
  assert.equal(root.status, 200);
  assertHtml(root.body, repoFile("index.html"));
  console.log("PASS legacy redirects and unchanged personal homepage:", host);
}

const oldDownload = await follow("https://chiuist.com/dropedge/downloads/DropEdge-Latest.dmg");
assert.equal(oldDownload.status, 200);
assert.equal(sha256(oldDownload.body), expectedDmg);
console.log("PASS full legacy download redirect chain:", oldDownload.url);

for (const pathname of ["articles", "home.css", "article-pages.css", "cat-stars/privacy-policy.html", "safeshot/privacy.html"]) {
  const response = await request("https://chiuist.com/" + pathname);
  // Existing .html aliases may canonicalize; their status must not be changed by our Worker.
  assert([200, 307].includes(response.status), pathname);
  if (response.status === 200) {
    const source = pathname === "articles" ? "articles.html" : pathname;
    if (source.endsWith(".html")) assertHtml(response.body, repoFile(source));
    else assert.equal(sha256(response.body), sha256(repoFile(source)));
  }
  console.log("PASS existing page:", pathname);
}

for (const url of [product + "/articles", product + "/does-not-exist", "https://chiuist.com/worker.mjs", "https://chiuist.com/tests/worker.test.mjs", "https://chiuist.com/wrangler.jsonc"]) {
  assert.equal((await request(url)).status, 404, url);
}
console.log("PASS product isolation and non-public implementation files");
console.log("All integration checks passed.");
