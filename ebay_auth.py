import os
import base64
import time
import json
import hashlib
import requests
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
EBAY_ENV = os.getenv("EBAY_ENV", "sandbox").lower()  

if not CLIENT_ID or not CLIENT_SECRET:
    raise RuntimeError("Missing CLIENT_ID or CLIENT_SECRET (check your .env and load_dotenv())")

if EBAY_ENV not in ("sandbox", "production"):
    raise RuntimeError("EBAY_ENV must be 'sandbox' or 'production'")

TOKEN_URL = (
    "https://api.sandbox.ebay.com/identity/v1/oauth2/token"
    if EBAY_ENV == "sandbox"
    else "https://api.ebay.com/identity/v1/oauth2/token"
)

# Use the right scope(s) for your API. This is the "base" scope.
SCOPE = os.getenv("EBAY_SCOPE", "https://api.ebay.com/oauth/api_scope")

REFRESH_BUFFER = 60  # seconds

def _cache_path() -> str:
    # Cache should vary by env + client + scope
    client_tag = CLIENT_ID[:8]  # don't write full id to disk logs
    scope_hash = hashlib.sha256(SCOPE.encode("utf-8")).hexdigest()[:12]
    return f".ebay_token_cache.{EBAY_ENV}.{client_tag}.{scope_hash}.json"

def get_app_token():
    basic = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode("utf-8")).decode("utf-8")

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Basic {basic}",
    }
    data = {
        "grant_type": "client_credentials",
        "scope": SCOPE,
    }

    r = requests.post(TOKEN_URL, headers=headers, data=data, timeout=30)
    if not r.ok:
        raise RuntimeError(f"Token request failed: {r.status_code} {r.text}")

    j = r.json()
    token = j["access_token"]
    expires_in = int(j.get("expires_in", 0))
    # Store the "refresh-at" time, not the actual expiry time
    refresh_at = int(time.time()) + max(expires_in - REFRESH_BUFFER, 0)
    return token, refresh_at

def _load_cached_token():
    path = _cache_path()
    if not os.path.exists(path):
        return None, 0

    try:
        with open(path, "r") as f:
            data = json.load(f)
        return data.get("access_token"), int(data.get("refresh_at", 0))
    except Exception:
        return None, 0

def _save_cached_token(token: str, refresh_at: int):
    path = _cache_path()
    with open(path, "w") as f:
        json.dump({"access_token": token, "refresh_at": refresh_at}, f)

def get_token_cached():
    token, refresh_at = _load_cached_token()
    now = int(time.time())

    if token and refresh_at > now:
        return token, refresh_at

    token, refresh_at = get_app_token()
    _save_cached_token(token, refresh_at)
    return token, refresh_at

if __name__ == "__main__":
    token, refresh_at = get_token_cached()
    print("Env:", EBAY_ENV)
    print("Token endpoint:", TOKEN_URL)
    print("Refresh at (local):", datetime.fromtimestamp(refresh_at))
    print("Seconds left:", max(0, refresh_at - int(time.time())))
