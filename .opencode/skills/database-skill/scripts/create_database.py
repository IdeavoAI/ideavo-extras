import os
import sys
import json
import urllib.request
import urllib.error


def create_database(provider: str) -> str:
    if provider != "neon":
        raise ValueError(f"Unsupported provider '{provider}'. Only 'neon' is supported.")

    service_token = os.environ.get("IDEAVO_SERVICE_TOKEN")
    if not service_token:
        raise RuntimeError("IDEAVO_SERVICE_TOKEN environment variable is not set")

    service_url = os.environ.get("IDEAVO_SERVICE_URL")
    if not service_url:
        raise RuntimeError("IDEAVO_SERVICE_URL environment variable is not set")

    url = f"{service_url}/api/ideavo/database/create"
    payload = json.dumps({"provisioner": provider}).encode()
    headers = {
        "Content-Type": "application/json",
        "x-proxy-token": service_token,
    }

    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())

    if not result.get("success"):
        raise RuntimeError(result.get("error") or "Unknown error from service")

    database_url = result["data"]["databaseUrl"]
    return database_url


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python create_database.py <provider>", file=sys.stderr)
        sys.exit(1)

    provider = sys.argv[1]
    print(create_database(provider))
