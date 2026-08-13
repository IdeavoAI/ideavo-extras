function getArg(name) {
  const prefix = `${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(name);
  if (index !== -1) return process.argv[index + 1];
}

const LOG_PATH = getArg("--file");
const PORT = Number(getArg("--port"));

if (!LOG_PATH || !Number.isSafeInteger(PORT) || PORT <= 0) {
  console.error("Usage: bun server.js --file <logs.ndjsonl> --port <port>");
  process.exit(1);
}

async function getSafeOffset(file, size) {
  if (size === 0) return 0;

  const text = await file.text();
  const lastNewline = text.lastIndexOf("\n");
  return lastNewline === -1 ? 0 : lastNewline + 1;
}

async function readFromOffset(offset) {
  const file = Bun.file(LOG_PATH);
  const size = file.size;
  const safeOffset = await getSafeOffset(file, size);

  if (offset >= safeOffset) {
    return { text: "", offset: safeOffset };
  }

  const raw = await file.slice(offset, safeOffset).text();
  let start = 0;

  if (offset > 0) {
    const previousByte = await file.slice(offset - 1, offset).text();
    if (previousByte !== "\n") {
      const firstNewline = raw.indexOf("\n");
      if (firstNewline === -1) {
        return { text: "", offset };
      }
      start = firstNewline + 1;
    }
  }

  return {
    text: raw.slice(start),
    offset: safeOffset
  };
}

function response(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
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
    });
  }

  const compressed = Bun.gzipSync(Buffer.from(body));

  return response(compressed, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Content-Encoding": "gzip",
      ...headers
    }
  });
}

Bun.serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return response(null, { status: 204 });
    }

    if (url.pathname === "/health") {
      return response(
        JSON.stringify({
          success: true,
          logPath: LOG_PATH,
          port: PORT,
          endpoints: ["GET /", "GET /?offset=0", "GET /health"]
        }),
        { headers: { "Content-Type": "application/json" } }
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
          }
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
    });
  }
});

console.log(`Log server running on http://localhost:${PORT}`);
console.log(`Reading logs from ${LOG_PATH}`);
