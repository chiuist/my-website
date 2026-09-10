const DROPEDGE_HOST = "dropedge.chiuist.com";
const DROPEDGE_ORIGIN = `https://${DROPEDGE_HOST}`;
const DROPEDGE_PREFIX = "/dropedge";
const STATIC_SITE_HOSTS = new Map([
  ["then-do.chiuist.com", "/then-do"],
  ["s-calendar.chiuist.com", "/s-calendar"],
]);
const REVIEW_PAGE_HOST = "chiuist.com";
const REVIEW_PAGE_ASSETS = new Map([
  ["/thendo/privacy.html", "/thendo/privacy"],
  ["/thendo/support.html", "/thendo/support"],
  ["/calendar/privacy.html", "/calendar/privacy"],
]);
const LEGACY_HOSTS = new Set([
  "chiuist.com",
  "www.chiuist.com",
  "heyhong.net",
  "www.heyhong.net",
]);
const ENGLISH_PAGE_ASSETS = new Map([
  ["/", `${DROPEDGE_PREFIX}/en/`],
  ["/privacy", `${DROPEDGE_PREFIX}/en/privacy`],
  ["/support", `${DROPEDGE_PREFIX}/en/support`],
]);

function isDropEdgePath(pathname) {
  return pathname === DROPEDGE_PREFIX || pathname.startsWith(`${DROPEDGE_PREFIX}/`);
}

function publicPath(pathname) {
  return pathname.slice(DROPEDGE_PREFIX.length) || "/";
}

function redirectToDropEdge(pathname, search) {
  const target = new URL(DROPEDGE_ORIGIN);
  // Assign pathname separately so a leading // cannot change the destination host.
  target.pathname = pathname;
  target.search = search;
  return Response.redirect(target.href, 308);
}

function hideInternalPrefix(response, assetUrl, prefix) {
  const location = response.headers.get("Location");
  if (!location || response.status < 300 || response.status >= 400) return response;

  const target = new URL(location, assetUrl);
  if (target.origin !== assetUrl.origin || !(target.pathname === prefix || target.pathname.startsWith(`${prefix}/`))) return response;

  // Static Assets may canonicalize directories and .html paths. Keep the
  // internal asset directory out of every public custom-domain redirect.
  target.pathname = target.pathname.slice(prefix.length) || "/";
  const redirected = new Response(response.body, response);
  redirected.headers.set("Location", target.href);
  return redirected;
}

function preferredLanguage(request) {
  const firstPreference = (request.headers.get("Accept-Language") || "")
    .split(",", 1)[0]
    .split(";", 1)[0]
    .trim()
    .toLowerCase();
  return firstPreference === "zh" || firstPreference.startsWith("zh-") ? "zh-CN" : "en";
}

function withLanguageHeaders(response, language) {
  const localized = new Response(response.body, response);
  localized.headers.set("Content-Language", language);
  const vary = localized.headers.get("Vary");
  const fields = vary ? vary.split(",").map(field => field.trim().toLowerCase()) : [];
  if (!fields.includes("accept-language")) {
    localized.headers.set("Vary", vary ? `${vary}, Accept-Language` : "Accept-Language");
  }
  return localized;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isDropEdgeHost = url.hostname === DROPEDGE_HOST;

    const reviewAssetPath = url.hostname === REVIEW_PAGE_HOST ? REVIEW_PAGE_ASSETS.get(url.pathname) : undefined;
    if (reviewAssetPath) {
      const assetUrl = new URL(url);
      // Fetch the pretty internal asset so the public .html review URL stays 200.
      assetUrl.pathname = reviewAssetPath;
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    if (isDropEdgePath(url.pathname) && (isDropEdgeHost || LEGACY_HOSTS.has(url.hostname))) {
      return redirectToDropEdge(publicPath(url.pathname), url.search);
    }

    const staticSitePrefix = STATIC_SITE_HOSTS.get(url.hostname);
    if (staticSitePrefix) {
      const assetUrl = new URL(url);
      // Keep the public legal URLs aligned with their .html canonicals while
      // serving the static platform's extensionless document internally.
      const documentPath = ["/privacy.html", "/support.html"].includes(url.pathname)
        ? url.pathname.slice(0, -5)
        : url.pathname;
      assetUrl.pathname = `${staticSitePrefix}${documentPath}`;
      return hideInternalPrefix(await env.ASSETS.fetch(new Request(assetUrl, request)), assetUrl, staticSitePrefix);
    }

    // All existing personal-site domains and Workers preview URLs keep their assets.
    if (!isDropEdgeHost) return env.ASSETS.fetch(request);

    if (url.protocol !== "https:") {
      return redirectToDropEdge(url.pathname, url.search);
    }

    const language = preferredLanguage(request);
    const englishAsset = language === "en" ? ENGLISH_PAGE_ASSETS.get(url.pathname) : undefined;
    const assetUrl = new URL(url);
    assetUrl.pathname = englishAsset || `${DROPEDGE_PREFIX}${url.pathname}`;
    // Keep method, conditional/range headers and the response body stream unchanged.
    const response = await env.ASSETS.fetch(new Request(assetUrl, request));
    const publicResponse = hideInternalPrefix(response, assetUrl, DROPEDGE_PREFIX);
    return ENGLISH_PAGE_ASSETS.has(url.pathname) ? withLanguageHeaders(publicResponse, language) : publicResponse;
  },
};
