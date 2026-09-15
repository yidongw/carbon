// 返回定长 JSON 响应(显式 Content-Length),避免 react-router 的 node 适配器把
// 响应按 Transfer-Encoding: chunked 流式发送 —— 微信小程序 wx.request 对没有
// Content-Length 的 chunked 响应会一直等待、挂起。签名与 Response.json 一致。
export function jsonResponse(
  body: unknown,
  init?: { status?: number }
): Response {
  const text = JSON.stringify(body);
  return new Response(text, {
    status: init?.status ?? 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-length": String(new TextEncoder().encode(text).length)
    }
  });
}
