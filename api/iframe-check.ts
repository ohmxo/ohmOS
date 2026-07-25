/**
 * Simple fetch proxy for Internet Explorer.
 *
 * Strips X-Frame-Options / frame-ancestors so pages load in the iframe,
 * rewrites cross-origin resource URLs (img/script/link/source) through the
 * raw proxy to avoid CORS blocks, and caps oversized HTML to prevent tab
 * freezes. That's it — no Wayback, AI, headless, sessions, or debug cruft.
 */
import { apiHandler } from "./_utils/api-handler.js";
import { getAppPublicOrigin } from "./_utils/runtime-config.js";
import { SsrfBlockedError } from "./_utils/_ssrf.js";
import {
  readResponseTextWithLimit,
  sanitizeProxiedHtml,
} from "./_utils/_ie-html.js";

// Maximum redirects to follow
const MAX_REDIRECTS = 5;

export default apiHandler(
  {
    methods: ["GET"],
    contentType: null,
    allowMissingOrigin: true,
  },
  async ({ req, res, logger, origin }) => {
    const urlParam = req.query.url as string | undefined;
    if (!urlParam) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    const normalizedUrl = urlParam.startsWith("http")
      ? urlParam
      : `https://${urlParam}`;

    // Validate URL — basic check, allow public hosts
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(normalizedUrl);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return res.status(400).json({ error: "Only http/https URLs allowed" });
      }
      // Block private/reserved IPs (sync DNS resolve)
      const hostname = parsedUrl.hostname.toLowerCase();
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1" ||
        hostname === "0.0.0.0" ||
        hostname.endsWith(".local") ||
        hostname.endsWith(".internal")
      ) {
        return res.status(400).json({ error: "Blocked hostname" });
      }
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const isRawProxy = req.query.raw === "1" || req.query.raw === "true";
    const proxyBase = getAppPublicOrigin(origin);
    const upstreamOrigin = parsedUrl.origin;

    // Fetch the upstream page
    let upstreamRes: Response;
    let finalUrl = normalizedUrl;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      upstreamRes = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.8",
        },
        redirect: "manual",
      });
      clearTimeout(timeout);

      // Follow redirects manually (not more than MAX_REDIRECTS)
      let redirectsLeft = MAX_REDIRECTS;
      let currentUrl = normalizedUrl;
      let currentRes = upstreamRes;
      while (
        redirectsLeft > 0 &&
        currentRes.status >= 300 &&
        currentRes.status < 400
      ) {
        const location = currentRes.headers.get("location");
        if (!location) break;
        const nextUrl = new URL(location, currentUrl).toString();
        // Drain body
        await currentRes.arrayBuffer().catch(() => {});
        currentUrl = nextUrl;
        currentRes = await fetch(currentUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: currentRes.headers.get("Accept") || "*/*",
          },
          redirect: "manual",
        });
        redirectsLeft--;
      }
      upstreamRes = currentRes;
      finalUrl = currentUrl;
    } catch (fetchErr: unknown) {
      const msg =
        fetchErr instanceof Error ? fetchErr.message : "Fetch failed";
      return res
        .status(502)
        .json({
          error: "proxy_error",
          message: `Failed to fetch ${normalizedUrl}: ${msg}`,
        });
    }

    const contentType = upstreamRes.headers.get("content-type") || "";

    // Helper to build raw proxy URLs for cross-origin resources
    const rawUrl = (href: string): string =>
      `${proxyBase}/api/iframe-check?raw=1&url=${encodeURIComponent(href)}`;

    // --- Raw proxy mode (sub-resources) ---
    if (isRawProxy) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, HEAD");
      if (contentType) res.setHeader("Content-Type", contentType);
      const cacheControl = upstreamRes.headers.get("cache-control");
      if (cacheControl) res.setHeader("Cache-Control", cacheControl);
      res.status(upstreamRes.status);
      const body = upstreamRes.body as ReadableStream<Uint8Array> | null;
      if (body) {
        const reader = body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value && value.length > 0) {
            res.write(Buffer.from(value));
          }
        }
      }
      res.end();
      return;
    }

    // --- HTML proxy mode ---
    if (!contentType.includes("text/html")) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      if (contentType) res.setHeader("Content-Type", contentType);
      const cacheControl = upstreamRes.headers.get("cache-control");
      if (cacheControl) res.setHeader("Cache-Control", cacheControl);
      res.status(upstreamRes.status);
      const body = upstreamRes.body as ReadableStream<Uint8Array> | null;
      if (body) {
        const reader = body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value && value.length > 0) {
            res.write(Buffer.from(value));
          }
        }
      }
      res.end();
      return;
    }

    // Read and sanitize HTML
    let html: string;
    try {
      html = await readResponseTextWithLimit(upstreamRes);
    } catch (sizeErr: unknown) {
      const msg = sizeErr instanceof Error ? sizeErr.message : "Page too large";
      return res.status(413).json({ error: "page_too_large", message: msg });
    }

    const sanitized = await sanitizeProxiedHtml(html, {
      pageUrl: finalUrl,
    });
    html = sanitized.html;

    // Strip CSP / X-Frame-Options meta tags
    html = html.replace(/<meta[^>]*http-equiv\s*=\s*["']?Content-Security-Policy["']?[^>]*>/gi, "");
    html = html.replace(/<meta[^>]*http-equiv\s*=\s*["']?X-Frame-Options["']?[^>]*>/gi, "");
    html = html.replace(/<meta[^>]*http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi, "");
    html = html.replace(
      /<meta[^>]*content\s*=\s*["'][^"']*["'][^>]*http-equiv\s*=\s*["']?Content-Security-Policy["']?[^>]*>/gi,
      ""
    );

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch
      ? decodeURIComponent(
          encodeURIComponent(titleMatch[1].trim()).replace(/%../g, "")
        )
      : null;

    // --- URL rewriting: redirect all cross-origin resource URLs through the proxy ---
    const rewriteAttrs = html.replace(
      /(<(?:img|script|link|source|video)\b[^>]*?)(src|href|poster)\s*=\s*"(https?:\/\/[^"]+)"/gi,
      (_match, prefix: string, attr: string, url: string) => {
        if (url.startsWith(proxyBase)) return _match;
        return `${prefix}${attr}="${rawUrl(url)}"`;
      }
    );
    // Also handle srcset
    const rewrittenSrcset = rewriteAttrs.replace(
      /(<source\b[^>]*?srcset\s*=\s*")([^"]+)"/gi,
      (_match, prefix: string, srcset: string) => {
        const reworked = srcset.replace(
          /(https?:\/\/[^\s,]+)(\s*[,\s]?)/g,
          (m: string, url: string, trail: string) =>
            url.startsWith(proxyBase) ? m : `${rawUrl(url)}${trail}`
        );
        return `${prefix}${reworked}"`;
      }
    );

    // Strip any existing <base> tag before injecting ours
    html = rewrittenSrcset.replace(/<base\s[^>]*>/gi, "");

    // Inject <base> tag and minimal navigation interceptor in <head>
    const headInsert =
      `<base href="${finalUrl}">` +
      (pageTitle ? `<meta name="page-title" content="${encodeURIComponent(pageTitle)}">` : "") +
      `<script>
(function(){
  var po = window.parent || window.opener || window.top;
  function nav(url,s,newWin){
    try{
      var a=new URL(url,document.baseURI||location.href).href;
      if(a.startsWith("javascript:")||a.startsWith("blob:")||a.startsWith("data:")) return false;
      po.postMessage({type:newWin?"iframeOpenWindow":"iframeNavigation",url:a,source:s},"*");
      return true;
    }catch(e){return false}
  }
  try{Object.defineProperty(window,"top",{get:function(){return window.self},configurable:true})}catch(e){}
  try{Object.defineProperty(window,"parent",{get:function(){return window.self},configurable:true})}catch(e){}
  document.addEventListener("click",function(e){
    if(e.ctrlKey||e.metaKey) return;
    var t=e.target,a=null;
    while(t&&t!==document.documentElement){if(t.tagName==="A"&&t.href){a=t;break}t=t.parentElement}
    if(a&&a.href&&nav(a.href,"click",(a.getAttribute("target")||"").toLowerCase()==="_blank")) e.preventDefault();
  },true);
  document.addEventListener("submit",function(e){
    var f=e.target;
    if(f&&f.tagName==="FORM"){
      var a=f.getAttribute("action")||location.href;
      if(nav(a,"form-submit")) e.preventDefault();
    }
  },true);
  var ow=window.open;
  window.open=function(u,t,f){
    if(u&&nav(u,"window-open",!t||t.toLowerCase()==="_blank"||t.toLowerCase()==="_new")) return null;
    return ow?ow.call(window,u,t,f):null;
  };
  window.fetch=new Proxy(window.fetch,{apply:function(t,thisArg,a){
    try{
      var u=typeof a[0]==="string"?a[0]:a[0] instanceof Request?a[0].url:String(a[0]);
      var r=new URL(u,document.baseURI);
      if(r.origin!==window.location.origin&&(r.protocol==="http:"||r.protocol==="https:")){
        a[0]=window.location.origin+"/api/iframe-check?raw=1&url="+encodeURIComponent(r.href);
      }
    }catch(e){}
    return Reflect.apply(t,thisArg,a);
  }});
  var xo=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(){
    try{
      var u=arguments[1];
      if(typeof u==="string"){var r=new URL(u,document.baseURI);if(r.origin!==window.location.origin) arguments[1]=window.location.origin+"/api/iframe-check?raw=1&url="+encodeURIComponent(r.href)}
    }catch(e){}
    return xo.apply(this,arguments);
  };
})();
</script>`;

    const headIdx = html.search(/<head[^>]*>/i);
    if (headIdx !== -1) {
      const insPos = headIdx + html.match(/<head[^>]*>/i)![0].length;
      html = html.slice(0, insPos) + headInsert + html.slice(insPos);
    } else {
      html = "<head>" + headInsert + "</head>" + html;
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    if (pageTitle) {
      res.setHeader("X-Proxied-Page-Title", encodeURIComponent(pageTitle));
    }
    logger.response(upstreamRes.status, Date.now() - Date.now());
    return res.status(upstreamRes.status).send(html);
  }
);
