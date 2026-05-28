import { REDIS_URL } from "@carbon/env";
import Redis from "ioredis";

declare global {
  var __redis: Redis | undefined;
}

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

function createRedis() {
  const useTls =
    REDIS_URL.startsWith("rediss://") || REDIS_URL.includes(".upstash.io");

  const client = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableOfflineQueue: true,
    enableReadyCheck: true,
    ...(useTls ? { tls: {} } : {}),
    reconnectOnError(err) {
      const message = err.message ?? "";
      return (
        message.includes("Connection is closed") ||
        message.includes("ECONNRESET") ||
        message.includes("ETIMEDOUT")
      );
    },
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 50, 2000);
    }
  });

  // Serverless warm instances reuse a global client; Upstash closes idle sockets.
  const drop = () => {
    if (global.__redis === client) {
      global.__redis = undefined;
    }
  };
  client.on("close", drop);
  client.on("end", drop);

  return client;
}

function getRedis(): Redis {
  const existing = global.__redis;
  if (
    !existing ||
    existing.status === "end" ||
    existing.status === "close"
  ) {
    global.__redis = createRedis();
  }
  return global.__redis;
}

// Always resolve the live client — a module-level reference can point at a
// connection GoTrue/Upstash closed between serverless invocations.
const redis: Redis = new Proxy({} as Redis, {
  get(_target, prop) {
    const client = getRedis();
    const value = client[prop as keyof Redis];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  }
});

export default redis;
