import { db } from "./_shared";

interface ServiceHealthResult {
  name: string;
  status: "healthy" | "degraded" | "down";
  responseTime: number;
  details?: Record<string, unknown>;
}

const checkEndpoint = async (
  name: string,
  url: string,
  timeoutMs = 5000
): Promise<ServiceHealthResult> => {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    const responseTime = Date.now() - start;
    const details = res.headers.get("content-type")?.includes("json")
      ? await res.json().catch(() => ({}))
      : {};
    return {
      name,
      status: res.ok ? "healthy" : "degraded",
      responseTime,
      details,
    };
  } catch {
    return {
      name,
      status: "down",
      responseTime: Date.now() - start,
    };
  }
};

export const getServiceHealth = async () => {
  const checks: Promise<ServiceHealthResult>[] = [
    checkEndpoint("Backend API", `${process.env.NEXT_PUBLIC_API_URL}/`),
    checkEndpoint("Upload Service", `${process.env.UPLOAD_SERVICE_URL}/health`),
  ];

  const services = await Promise.allSettled(checks);

  const results: ServiceHealthResult[] = services.map((s) =>
    s.status === "fulfilled"
      ? s.value
      : { name: "Unknown", status: "down" as const, responseTime: 0 }
  );

  // Check PostgreSQL
  const dbStart = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    results.push({
      name: "PostgreSQL",
      status: "healthy",
      responseTime: Date.now() - dbStart,
    });
  } catch {
    results.push({
      name: "PostgreSQL",
      status: "down",
      responseTime: Date.now() - dbStart,
    });
  }

  // Check Redis
  const redisStart = Date.now();
  try {
    const { default: IORedis } = await import("ioredis");
    const redis = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
      connectTimeout: 3000,
      lazyConnect: true,
    });
    await redis.connect();
    await redis.ping();
    await redis.quit();
    results.push({
      name: "Redis",
      status: "healthy",
      responseTime: Date.now() - redisStart,
    });
  } catch {
    results.push({
      name: "Redis",
      status: "down",
      responseTime: Date.now() - redisStart,
    });
  }

  return {
    services: results,
    checkedAt: new Date().toISOString(),
  };
};
