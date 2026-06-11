export default async (request, context) => {
  const url = new URL(request.url);

  // فقط مسیر /api رله بشه، بقیه سایت نرمال کار کنه
  if (!url.pathname.startsWith("/api")) {
    return context.next();
  }

  const TARGET = "https://net.esmatshonam.shop:443";
  const targetUrl = TARGET + url.pathname + url.search;

  const newHeaders = new Headers(request.headers);
  newHeaders.set("host", "net.esmatshonam.shop");
  newHeaders.delete("x-forwarded-for");
  newHeaders.delete("x-nf-client-connection-ip");

  try {
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: newHeaders,
      body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
    });

    const response = await fetch(proxyRequest);

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("x-powered-by", "NexaCore-Edge");

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response("Gateway error", { status: 502 });
  }
};
