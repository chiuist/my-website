const DROPEDGE_HOST = "dropedge.chiuist.com";
const DROPEDGE_ORIGIN = `https://${DROPEDGE_HOST}`;
const DROPEDGE_PREFIX = "/dropedge";
const LEGACY_HOSTS = new Set([
  "chiuist.com",
  "www.chiuist.com",
  "heyhong.net",
  "www.heyhong.net",
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

    const assetUrl = new URL(url);
    assetUrl.pathname = `${DROPEDGE_PREFIX}${url.pathname}`;
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

    return response;
  },
};
