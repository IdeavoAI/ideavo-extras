import { readFileSync } from "node:fs";
import os from "node:os";

function getArg(name) {
  const prefix = `${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(name);
  if (index !== -1) return process.argv[index + 1];
}

const LOG_PATH = getArg("--file");
const PORT = Number(getArg("--port"));
const ALLOWED_ORIGINS = new Set([
  "http://localhost:8081",
  "https://ideavo.ai"
]);
const CPU_SAMPLE_MS = 200;

if (!LOG_PATH || !Number.isSafeInteger(PORT) || PORT <= 0) {
  console.error("Usage: bun server.js --file <logs.ndjsonl> --port <port>");
  process.exit(1);
}

async function readFromOffset(offset) {
  const file = Bun.file(LOG_PATH);
  if (!(await file.exists())) {
    return { text: "", offset: 0 };
  }

  const size = file.size;

  if (offset > size) {
    return { text: "", offset: 0 };
  }

  if (offset === size) {
    return { text: "", offset: size };
  }

  const bytes = new Uint8Array(await file.slice(offset, size).arrayBuffer());
  const previousByte =
    offset === 0
      ? 10
      : new Uint8Array(await file.slice(offset - 1, offset).arrayBuffer())[0];
  const startsAtBoundary = offset === 0 || previousByte === 10;
  let start = 0;

  if (!startsAtBoundary) {
    const firstNewline = bytes.indexOf(10);
    if (firstNewline === -1) {
      return { text: "", offset };
    }

    start = firstNewline + 1;
  }

  const safeEnd = bytes.lastIndexOf(10) + 1;

  if (safeEnd <= start) {
    return { text: "", offset: offset + start };
  }

  return {
    text: new TextDecoder().decode(bytes.slice(start, safeEnd)),
    offset: offset + safeEnd
  };
}

async function readMetrics() {
  const cpuTimes = () =>
    os.cpus().reduce(
      (sum, { times }) => ({
        idle: sum.idle + times.idle,
        total:
          sum.total + times.user + times.nice + times.sys + times.idle + times.irq
      }),
      { idle: 0, total: 0 }
    );
  const start = cpuTimes();
  await Bun.sleep(CPU_SAMPLE_MS);
  const end = cpuTimes();
  const elapsed = end.total - start.total;

  const meminfo = readFileSync("/proc/meminfo", "utf8");
  const memoryBytes = (key) =>
    Number(meminfo.match(new RegExp(`^${key}:\\s+(\\d+)`, "m"))[1]) * 1024;
  const memoryTotal = memoryBytes("MemTotal");

  const df = Bun.spawn(["df", "-B1", "--output=size,used", import.meta.dir]);
  const dfOutput = await new Response(df.stdout).text();
  const [diskTotal, diskUsed] = dfOutput
    .trim()
    .split("\n")
    .at(-1)
    .trim()
    .split(/\s+/)
    .map(Number);
  if (!Number.isSafeInteger(diskTotal)) throw new Error("Invalid df output");

  return {
    cpu: {
      usage: elapsed > 0 ? 100 * (1 - (end.idle - start.idle) / elapsed) : 0,
      cores: os.cpus().length
    },
    memory: {
      total: memoryTotal,
      used: memoryTotal - memoryBytes("MemAvailable")
    },
    disk: { total: diskTotal, used: diskUsed }
  };
}

function response(body, init = {}, request) {
  const origin = request?.headers.get("origin");
  const corsHeaders = ALLOWED_ORIGINS.has(origin)
    ? { "Access-Control-Allow-Origin": origin }
    : {};

  return new Response(body, {
    ...init,
    headers: {
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Expose-Headers": "X-Next-Offset",
      Vary: "Origin",
      ...corsHeaders,
      ...init.headers
    }
  });
}

function acceptsGzip(request) {
  return request.headers.get("accept-encoding")?.includes("gzip") ?? false;
}

async function logResponse(request, body, headers = {}) {
  if (!acceptsGzip(request)) {
    return response(body, {
      headers: {
        "Content-Type": "application/x-ndjson",
        ...headers
      }
    }, request);
  }

  const compressed = Bun.gzipSync(Buffer.from(body));

  return response(compressed, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Content-Encoding": "gzip",
      ...headers
    }
  }, request);
}

Bun.serve({
  hostname: "127.0.0.1",
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return response(null, { status: 204 }, request);
    }

    if (url.pathname === "/health") {
      return response(
        JSON.stringify({
          success: true,
          logPath: LOG_PATH,
          port: PORT,
          endpoints: ["GET /", "GET /?offset=0", "GET /health", "GET /metrics"]
        }),
        { headers: { "Content-Type": "application/json" } },
        request
      );
    }

    if (url.pathname === "/metrics") {
      return response(
        JSON.stringify(await readMetrics()),
        { headers: { "Content-Type": "application/json" } },
        request
      );
    }

    if (url.pathname === "/") {
      const hasOffset = url.searchParams.has("offset");
      const offset = hasOffset ? Number(url.searchParams.get("offset")) : 0;

      if (!Number.isSafeInteger(offset) || offset < 0) {
        return response(
          JSON.stringify({ success: false, error: "Invalid offset" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          },
          request
        );
      }

      const result = await readFromOffset(offset);
      return logResponse(request, result.text, {
        "X-Next-Offset": String(result.offset)
      });
    }

    return response(JSON.stringify({ success: false, error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    }, request);
  }
});

console.log(`Log server running on http://localhost:${PORT}`);
console.log(`Reading logs from ${LOG_PATH}`);
