# Sucht freie Bilder/Videos auf Wikimedia Commons: python3 commons.py "suche" [video]
import json, sys, re, time, urllib.parse, urllib.request
UA = "DailyNatureVideo/0.1 (educational shorts)"
def api(params):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({"format": "json", **params})
    for k in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r: return json.load(r)
        except Exception as e: time.sleep(2 * (k + 1))
    return {}
def search(q, video=False, n=20):
    s = q + (" filetype:video" if video else " filetype:bitmap")
    d = api({"action": "query", "generator": "search", "gsrnamespace": 6, "gsrlimit": n, "gsrsearch": s, "prop": "imageinfo",
             "iiprop": "url|size|mime|extmetadata", "iiurlwidth": 1600, "iiextmetadatafilter": "LicenseShortName|Artist"})
    out = []
    for p in d.get("query", {}).get("pages", {}).values():
        ii = p["imageinfo"][0]; m = ii.get("extmetadata", {})
        lic = m.get("LicenseShortName", {}).get("value", "")
        if not re.search(r"CC0|Public domain|CC BY(-SA)? [0-9.]+|PD", lic, re.I): continue
        out.append({"title": p["title"], "mime": ii["mime"], "w": ii.get("width"), "h": ii.get("height"), "dur": ii.get("duration"),
                    "url": ii["url"], "thumb": ii.get("thumburl"), "license": lic, "artist": re.sub("<[^>]+>", "", m.get("Artist", {}).get("value", "")).strip()[:60]})
    return out
if __name__ == "__main__":
    for r in search(sys.argv[1], len(sys.argv) > 2): print(json.dumps(r, ensure_ascii=False))
