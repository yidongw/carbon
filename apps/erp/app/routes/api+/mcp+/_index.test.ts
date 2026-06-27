import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requirePermissionsMock,
  createMcpServerMock,
  handleRequestMock,
  transportMock
} = vi.hoisted(() => ({
  requirePermissionsMock: vi.fn(),
  createMcpServerMock: vi.fn(),
  handleRequestMock: vi.fn(),
  transportMock: vi.fn().mockImplementation(() => ({
    handleRequest: handleRequestMock
  }))
}));

vi.mock("@carbon/auth/auth.server", () => ({
  requirePermissions: requirePermissionsMock
}));

vi.mock("./lib/server", () => ({
  createMcpServer: createMcpServerMock
}));

vi.mock("@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js", () => ({
  WebStandardStreamableHTTPServerTransport: transportMock
}));

describe("MCP route auth", () => {
  beforeEach(() => {
    requirePermissionsMock.mockReset();
    createMcpServerMock.mockReset();
    handleRequestMock.mockReset();

    requirePermissionsMock.mockResolvedValue({
      client: { id: "client" },
      companyId: "company-1",
      companyGroupId: "group-1",
      userId: "user-1"
    });
    createMcpServerMock.mockReturnValue({
      connect: vi.fn().mockResolvedValue(undefined)
    });
    handleRequestMock.mockResolvedValue(new Response("ok", { status: 200 }));
  });

  it("accepts GET requests with a bearer token", async () => {
    const { loader } = await import("./_index");

    const request = new Request("https://example.com/api/mcp", {
      method: "GET",
      headers: {
        Authorization: "Bearer test-api-key"
      }
    });

    const response = await loader({ request } as never);

    expect(requirePermissionsMock).toHaveBeenCalledTimes(1);
    const authRequest = requirePermissionsMock.mock.calls[0][0] as Request;
    expect(authRequest.headers.get("carbon-key")).toBe("test-api-key");
    expect(authRequest.headers.get("Authorization")).toBe("Bearer test-api-key");
    expect(handleRequestMock).toHaveBeenCalledWith(authRequest);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("ok");
  });
});
