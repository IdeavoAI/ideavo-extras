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

if (!LOG_PATH || !Number.isSafeInteger(PORT) || PORT <= 0) {
  console.error("Usage: bun server.js --file <logs.ndjsonl> --port <port>");
  process.exit(1);
}

async function readFromOffset(offset) {
  const file = Bun.file(LOG_PATH);
  if (!(await file.exists())) {
    return { text: "", offset: 0 };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const safeOffset = bytes.lastIndexOf(10) + 1;

  if (offset >= safeOffset) {
    return { text: "", offset: safeOffset };
  }

  let start = offset;

  if (offset > 0) {
    if (bytes[offset - 1] !== 10) {
      const firstNewline = bytes.indexOf(10, offset);
      if (firstNewline === -1) {
        return { text: "", offset };
      }
      start = firstNewline + 1;
    }
  }

  return {
    text: new TextDecoder().decode(bytes.slice(start, safeOffset)),
    offset: safeOffset
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
          endpoints: ["GET /", "GET /?offset=0", "GET /health"]
        }),
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
