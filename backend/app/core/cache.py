"""
Simple in-memory cache (development-safe)
Replace with Redis in production
"""

import time

_cache = {}


def set_cache(key: str, value, ttl: int = 60):
    _cache[key] = {
        "value": value,
        "expires": time.time() + ttl
    }


def get_cache(key: str):
    data = _cache.get(key)

    if not data:
        return None

    if time.time() > data["expires"]:
        del _cache[key]
        return None

    return data["value"]