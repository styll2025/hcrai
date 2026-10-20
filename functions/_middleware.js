// Send the Cloudflare preview hostname to the public site so search engines
// index https://www.hcrai.com instead of https://hcrai.pages.dev.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "hcrai.pages.dev") {
    url.hostname = "www.hcrai.com";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
