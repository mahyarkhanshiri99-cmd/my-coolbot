export default async (request, context) => {
  const url = new URL(request.url);
  const TARGET = "https://net.esmatshonam.shop:443"; 
  
  try {
    const targetUrl = `${TARGET}${url.pathname}${url.search}`;
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", "net.esmatshonam.shop");

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: newHeaders,
      body: ["POST", "PUT", "PATCH"].includes(request.method) ? request.body : null,
      redirect: "manual"
    });

    return response;
  } catch (error) {
    return new Response("Bridge Active", { status: 200 });
  }
};

export const config = { path: "/*" };
