import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { redis } from "@carbon/kv";

export async function loader() {
  const start = Date.now();

  // Run DB and Redis pings in parallel — both need to be warm before user traffic.
  // Redis cold connect (TLS to Upstash) costs ~700ms; Supabase first query ~900ms.
  // Warming them here ensures neither hits the user on first access.
  const [dbResult] = await Promise.all([
    Promise.race([
      getCarbonServiceRole().from("attributeDataType").select("id").limit(1),
      new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(
          () => resolve({ data: null, error: new Error("db timeout") }),
          5000
        )
      )
    ]),
    // Redis ping — establishes TLS connection to Upstash so login rate-limit is warm.
    // Ignore failures; Redis being cold is not a hard blocker.
    redis.ping().catch(() => null)
  ]);

  const responseTime = Date.now() - start;

  if (dbResult.error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: dbResult.error.message,
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
