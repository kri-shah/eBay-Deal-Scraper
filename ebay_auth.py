import os
import base64
import time
import json
import requests
from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

if not CLIENT_ID or not CLIENT_SECRET:
    raise RuntimeError("Missing CLIENT_ID or CLIENT_SECRET (check your .env and load_dotenv())")

OAUTH_URL = "https://api.sandbox.ebay.com/identity/v1/oauth2/token"
SCOPE = "https://api.ebay.com/oauth/api_scope"

CACHE_PATH = ".ebay_token_cache.json"

REFRESH_BUFFER = 60

def get_app_token():
    basic = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Basic {basic}",
    }
    data = {
        "grant_type": "client_credentials",
        "scope": SCOPE,
    }

    r = requests.post(OAUTH_URL, headers=headers, data=data, timeout=30)
    if not r.ok:
        raise RuntimeError(f"Token request failed: {r.status_code} {r.text}")

    j = r.json()
    token = j["access_token"]
    expires_in = int(j.get("expires_in", 0))
    expires_at = int(time.time()) + max(expires_in - REFRESH_BUFFER, 0)
    return token, expires_at


def _load_cached_token():
    if not os.path.exists(CACHE_PATH):
        return None, 0

    try:
        with open(CACHE_PATH, "r") as f:
            data = json.load(f)
        return data.get("access_token"), int(data.get("expires_at", 0))
    except Exception:
        return None, 0


def _save_cached_token(token: str, expires_at: int):
    with open(CACHE_PATH, "w") as f:
        json.dump({"access_token": token, "expires_at": expires_at}, f)


def get_token_cached():
    token, expires_at = _load_cached_token()
    now = int(time.time())

    if token and expires_at > now:
        return token, expires_at

    token, expires_at = get_app_token()
    _save_cached_token(token, expires_at)
    return token, expires_at

if __name__ == "__main__":
    token, expires_at = get_token_cached()
    print("Access token:", token[:20] + "...")
    print("Expires (local):", datetime.fromtimestamp(expires_at))
    print("Seconds left:", max(0, expires_at - int(time.time())))
