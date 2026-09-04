import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import worker from "../worker.mjs";

const origin = "https://dropedge.chiuist.com";

function assetsMock(response = new Response("asset")) {
  const requests = [];
  return { requests, response, ASSETS: { async fetch(request) { requests.push(request); return response; } } };
}

for (const pathname of ["/styles.css", "/assets/og.png", "/downloads/DropEdge-Latest.dmg", "/downloads/DropEdge-Free-1.6-build12.dmg", "/downloads/DropEdge-Free-1.6.dmg", "/updates/appcast.xml", "/updates/DropEdge-Free-1.6-build12.md"]) {
  test(`subdomain maps ${pathname} to DropEdge assets`, async () => {
    const env = assetsMock();
    const result = await worker.fetch(new Request(origin + pathname + "?v=12"), env);
    assert.equal(result, env.response);
    assert.equal(env.requests.length, 1);
    assert.equal(env.requests[0].url, origin + "/dropedge" + pathname + "?v=12");
  });
}

const languageCases = [
  [undefined, "en", "/dropedge/en/"],
  ["en-US,en;q=0.9", "en", "/dropedge/en/"],
  ["fr-FR,fr;q=0.9", "en", "/dropedge/en/"],
  ["ja-JP,zh-CN;q=0.9", "en", "/dropedge/en/"],
  ["zh", "zh-CN", "/dropedge/"],
  ["zh-CN,zh;q=0.9,en;q=0.8", "zh-CN", "/dropedge/"],
  ["zh-Hant-TW,zh;q=0.9", "zh-CN", "/dropedge/"],
];

for (const [acceptLanguage, language, assetPath] of languageCases) {
  test(`homepage selects ${language} for ${acceptLanguage || "no browser language"}`, async () => {
    const env = assetsMock(new Response("asset", { headers: { Vary: "Origin" } }));
    const headers = acceptLanguage ? { "Accept-Language": acceptLanguage } : {};
    const result = await worker.fetch(new Request(origin + "/?v=12", { headers }), env);
    assert.equal(new URL(env.requests[0].url).pathname, assetPath);
    assert.equal(new URL(env.requests[0].url).search, "?v=12");
    assert.equal(result.headers.get("Content-Language"), language);
    assert.equal(result.headers.get("Vary"), "Origin, Accept-Language");
  });
}

for (const [pathname, englishPath, chinesePath] of [
  ["/privacy", "/dropedge/en/privacy", "/dropedge/privacy"],
  ["/support", "/dropedge/en/support", "/dropedge/support"],
]) {
  test(`${pathname} negotiates English and Chinese without changing its public URL`, async () => {
    for (const [acceptLanguage, language, assetPath] of [
      ["de-DE,de;q=0.9", "en", englishPath],
      ["zh-TW,zh;q=0.9", "zh-CN", chinesePath],
    ]) {
      const env = assetsMock();
      const result = await worker.fetch(new Request(origin + pathname, { headers: { "Accept-Language": acceptLanguage } }), env);
      assert.equal(new URL(env.requests[0].url).pathname, assetPath);
      assert.equal(result.headers.get("Content-Language"), language);
      assert.match(result.headers.get("Vary"), /Accept-Language/);
    }
  });
}

for (const host of ["chiuist.com", "www.chiuist.com", "heyhong.net", "www.heyhong.net"]) {
  test(`${host} redirects only the legacy DropEdge directory`, async () => {
    const env = assetsMock();
    for (const pathname of ["/dropedge", "/dropedge/", "/dropedge/privacy.html", "/dropedge/downloads/DropEdge-Latest.dmg"]) {
      const result = await worker.fetch(new Request(`https://${host}${pathname}?source=old%20link`), env);
      assert.equal(result.status, 308);
      assert.equal(result.headers.get("Location"), origin + (pathname.slice(9) || "/") + "?source=old%20link");
    }
    assert.equal(env.requests.length, 0);
    for (const pathname of ["/", "/articles", "/cat-stars/privacy-policy.html", "/dropedge-other"]) {
      const request = new Request(`https://${host}${pathname}`);
      assert.equal(await worker.fetch(request, env), env.response);
      assert.equal(env.requests.at(-1), request);
    }
  });
}

test("Workers preview URLs retain the directory-based site", async () => {
  const env = assetsMock();
  const request = new Request("https://preview-my-website.heyhong-net.workers.dev/dropedge/");
  await worker.fetch(request, env);
  assert.equal(env.requests[0], request);
});

test("new domain removes redundant /dropedge prefix without redirecting to another host", async () => {
  const env = assetsMock();
  const result = await worker.fetch(new Request(origin + "/dropedge//example.com/file?x=1"), env);
  assert.equal(result.status, 308);
  assert.equal(result.headers.get("Location"), origin + "//example.com/file?x=1");
  assert.equal(env.requests.length, 0);
});

test("product URLs use HTTPS", async () => {
  const result = await worker.fetch(new Request("http://dropedge.chiuist.com/support?q=1"), assetsMock());
  assert.equal(result.status, 308);
  assert.equal(result.headers.get("Location"), origin + "/support?q=1");
});

for (const location of ["/dropedge/privacy?q=1", origin + "/dropedge/privacy?q=1", "privacy?q=1"]) {
  test(`HTML redirect ${location} uses the public root`, async () => {
    const env = assetsMock(new Response(null, { status: 307, headers: { Location: location, "Cache-Control": "public, max-age=0" } }));
    const result = await worker.fetch(new Request(origin + "/privacy.html?q=1"), env);
    assert.equal(result.status, 307);
    assert.equal(result.headers.get("Location"), origin + "/privacy?q=1");
    assert.equal(result.headers.get("Cache-Control"), "public, max-age=0");
  });
}

test("index redirect does not expose the internal directory or loop", async () => {
  const env = assetsMock(new Response(null, { status: 307, headers: { Location: "/dropedge/" } }));
  const result = await worker.fetch(new Request(origin + "/index.html"), env);
  assert.equal(result.headers.get("Location"), origin + "/");
});

test("download range/conditional requests and binary streams are preserved", async () => {
  const response = new Response(new Uint8Array([0, 1, 255]), { status: 206, headers: { "Content-Type": "application/octet-stream", "Content-Range": "bytes 0-2/2684442", ETag: '"build12"' } });
  const env = assetsMock(response);
  const request = new Request(origin + "/downloads/DropEdge-Latest.dmg", { headers: { Range: "bytes=0-2", "If-Range": '"build12"' } });
  const result = await worker.fetch(request, env);
  assert.equal(result, response);
  assert.equal(env.requests[0].headers.get("Range"), "bytes=0-2");
  assert.equal(env.requests[0].headers.get("If-Range"), '"build12"');
  assert.deepEqual(new Uint8Array(await result.arrayBuffer()), new Uint8Array([0, 1, 255]));
});

test("HEAD requests and missing assets retain their original response", async () => {
  const env = assetsMock(new Response(null, { status: 404 }));
  const result = await worker.fetch(new Request(origin + "/articles", { method: "HEAD" }), env);
  assert.equal(env.requests[0].method, "HEAD");
  assert.equal(new URL(env.requests[0].url).pathname, "/dropedge/articles");
  assert.equal(result.status, 404);
});

test("not-modified responses do not redirect", async () => {
  const env = assetsMock(new Response(null, { status: 304, headers: { ETag: '"build12"' } }));
  assert.equal(await worker.fetch(new Request(origin + "/styles.css"), env), env.response);
});

test("routing config runs before static assets and excludes implementation files", () => {
  const config = JSON.parse(readFileSync(new URL("../wrangler.jsonc", import.meta.url)));
  assert.equal(config.main, "worker.mjs");
  assert.equal(config.assets.binding, "ASSETS");
  assert.equal(config.assets.run_worker_first, true);
  assert.equal(config.routes, undefined, "keep the existing dashboard-managed domain bindings");
  const ignore = readFileSync(new URL("../.assetsignore", import.meta.url), "utf8");
  assert(ignore.includes("/worker.mjs"));
  assert(ignore.includes("/tests/"));
});

for (const source of ["../dropedge/index.html", "../dropedge/en/index.html"]) {
  test(`canonical metadata and download link resolve to the product domain in ${source}`, () => {
    const home = readFileSync(new URL(source, import.meta.url), "utf8");
    assert(home.includes(`rel="canonical" href="${origin}/"`));
    assert(home.includes(`property="og:image" content="${origin}/assets/og.png"`));
    assert(home.includes(`name="twitter:image" content="${origin}/assets/og.png"`));
    assert(!home.includes("https://chiuist.com/dropedge"));
    assert(home.includes('href="https://apps.apple.com/app/id6804663387"'));
    const href = home.match(/class="button primary" href="([^"]+)"/)[1];
    assert.equal(new URL(href, origin).href, origin + "/downloads/DropEdge-Free-1.6-build12.dmg");
  });
}

test("localized documents declare the expected language and equivalent public links", () => {
  const zhHome = readFileSync(new URL("../dropedge/index.html", import.meta.url), "utf8");
  const enHome = readFileSync(new URL("../dropedge/en/index.html", import.meta.url), "utf8");
  assert(zhHome.includes('<html lang="zh-Hans">'));
  assert(enHome.includes('<html lang="en">'));
  for (const home of [zhHome, enHome]) {
    assert(home.includes('href="privacy"'));
    assert(home.includes('href="support"'));
    assert(home.includes('href="https://apps.apple.com/app/id6804663387"'));
  }
  for (const path of ["privacy", "support"]) {
    assert(readFileSync(new URL(`../dropedge/${path}.html`, import.meta.url), "utf8").includes('<html lang="zh-Hans">'));
    assert(readFileSync(new URL(`../dropedge/en/${path}.html`, import.meta.url), "utf8").includes('<html lang="en">'));
  }
});

test("homepage product cards direct games to WeChat and Mac apps to the App Store", () => {
  const home = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  for (const [name, artwork] of [
    ["猫咪扫雷", "cat-stars.jpg"],
    ["怪谈修复铺", "ghostlight-relics.jpg"],
    ["SafeShot Lite", "safeshot-lite.png"],
    ["DropEdge", "dropedge.png"],
  ]) {
    assert(home.includes(`assets/products/${artwork}`), `${name} artwork is missing`);
    assert(readFileSync(new URL(`../assets/products/${artwork}`, import.meta.url)).length > 0);
  }
  assert(!home.includes("https://apps.apple.com/us/app/cat-stars/id6775446731"));
  assert(!home.includes("https://apps.apple.com/us/app/ghostlight-relics/id6777337695"));
  assert(home.includes("微信搜索「猫咪扫雷」"));
  assert(home.includes("微信搜索「怪谈修复铺」"));
  assert(home.includes('href="https://apps.apple.com/us/app/safeshot-lite/id6780211041?mt=12"'));
  assert(home.includes('href="https://apps.apple.com/us/app/dropedge/id6804663387?mt=12"'));
  assert.equal((home.match(/class="product-card(?: |")/g) || []).length, 4);
  assert.equal((home.match(/class="product-card product-card--static"/g) || []).length, 2);
  assert(!home.includes("data-product-dialog"));
  assert(!readFileSync(new URL("../home.js", import.meta.url), "utf8").includes("data-product"));
});
