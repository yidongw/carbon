import { getCarbonServiceRole } from "@carbon/auth/client.server";

export async function loader() {
  const start = Date.now();

  const client = getCarbonServiceRole();
  const { error } = await Promise.race([
    client.from("attributeDataType").select("id").limit(1),
    new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(
        () => resolve({ data: null, error: new Error("db timeout") }),
        5000
      )
    )
  ]);

  const responseTime = Date.now() - start;

  if (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: error.message,
        timestamp: new Date().toISOString(),
        responseTime
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      }
    );
  }

  return new Response(
    JSON.stringify({
      status: "ok",
      timestamp: new Date().toISOString(),
      responseTime
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    }
  );
}
