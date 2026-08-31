const DROPEDGE_HOST = "dropedge.chiuist.com";
const DROPEDGE_ORIGIN = `https://${DROPEDGE_HOST}`;
const DROPEDGE_PREFIX = "/dropedge";
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

    if (isDropEdgePath(url.pathname) && (isDropEdgeHost || LEGACY_HOSTS.has(url.hostname))) {
      return redirectToDropEdge(publicPath(url.pathname), url.search);
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
    const location = response.headers.get("Location");

    if (location && response.status >= 300 && response.status < 400) {
      const target = new URL(location, assetUrl);
      // Static Assets may redirect .html/index/trailing-slash URLs. Hide the
      // internal directory in those redirects so public URLs never gain /dropedge.
      if (target.origin === assetUrl.origin && isDropEdgePath(target.pathname)) {
        target.pathname = publicPath(target.pathname);
        const redirected = new Response(response.body, response);
        redirected.headers.set("Location", target.href);
        return redirected;
      }
    }

    return ENGLISH_PAGE_ASSETS.has(url.pathname) ? withLanguageHeaders(response, language) : response;
  },
};
