#!/usr/bin/env python3
"""Offerte dei volantini danesi (Lidl, Føtex, Bilka, Netto, REMA 1000) da terminale.

Uso:
  python avis.py aggiorna           scarica di nuovo le offerte
  python avis.py storico            aggiunge le offerte attuali a data/history.json
  python avis.py artifact [out]     crea una copia di index.html con le offerte incorporate

Solo libreria standard, nessuna dipendenza.
"""
import json
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from pathlib import Path

API = "https://squid-api.tjek.com/v2/offers"
STORES = [
    ("lidl", "71c90", "Lidl"),
    ("fotex", "bdf5A", "Føtex"),
    ("bilka", "93f13", "Bilka"),
    ("netto", "9ba51", "Netto"),
    ("rema", "11deC", "REMA 1000"),
]
BY_ID = {sid: key for key, sid, _ in STORES}
NAMES = {key: name for key, _, name in STORES}
ROOT = Path(__file__).resolve().parent
CACHE = ROOT / "data" / "offers.json"
CACHE_HOURS = 6
HISTORY = ROOT / "data" / "history.json"


def trim(o):
    q = o.get("quantity") or {}
    unit = q.get("unit") or {}
    si = unit.get("si") or {}
    size = q.get("size") or {}
    pricing = o.get("pricing") or {}
    return {
        "id": o["id"], "s": BY_ID.get(o.get("dealer_id")), "h": o.get("heading") or "",
        "d": o.get("description") or "", "p": pricing.get("price"), "pp": pricing.get("pre_price"),
        "u": si.get("symbol"), "f": si.get("factor"), "sf": size.get("from"), "st": size.get("to"),
        "pc": (q.get("pieces") or {}).get("from") or 1,
        "from": o.get("run_from"), "till": o.get("run_till"),
        "img": (o.get("images") or {}).get("thumb"),
    }


def get_json(url):
    for attempt in range(3):  # the API occasionally answers 5xx; retry briefly
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError:
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))


def fetch_store(store_id):
    """Offers are paged per flyer: the API stops at offset 1000 per query."""
    out = []
    for cat in get_json(f"https://squid-api.tjek.com/v2/catalogs?dealer_ids={store_id}&limit=100"):
        for offset in range(0, 1000, 100):
            page = get_json(f"{API}?catalog_ids={cat['id']}&limit=100&offset={offset}")
            out += [trim(o) for o in page]
            if len(page) < 100:
                break
    return out


def fetch_all():
    with ThreadPoolExecutor(len(STORES)) as ex:
        results = ex.map(fetch_store, [sid for _, sid, _ in STORES])
    data = {"fetchedAt": int(time.time() * 1000), "offers": [o for r in results for o in r]}
    CACHE.parent.mkdir(exist_ok=True)
    CACHE.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return data


def get_offers(force=False):
    if not force and CACHE.exists():
        data = json.loads(CACHE.read_text(encoding="utf-8"))
        if time.time() * 1000 - data["fetchedAt"] < CACHE_HOURS * 3600e3:
            return data
    print("Scarico le offerte…", file=sys.stderr)
    return fetch_all()


def unit_price(o):
    """(best, unit) price per kg/l/stk, or None; same rule as unitPrice() in match.js."""
    if o["p"] is None or not o["u"] or not o["f"] or not o["sf"]:
        return None
    hi = (o["st"] or o["sf"]) * o["f"] * (o["pc"] or 1)
    return (o["p"] / hi, "stk" if o["u"] == "pcs" else o["u"]) if hi > 0 else None


def load_history():
    try:
        return json.loads(HISTORY.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def cmd_storico():
    hist = load_history()
    data = fetch_all()
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    for o in data["offers"]:
        if not (o["s"] and o["p"] is not None and o["from"] and o["till"]):
            continue
        u = unit_price(o)
        rec = {"s": o["s"], "h": o["h"], "p": round(o["p"], 2), "from": o["from"][:10], "till": o["till"][:10],
               "seen": (hist.get(o["id"]) or {}).get("seen", today)}
        if u:
            rec["up"], rec["un"] = round(u[0], 2), u[1]
        hist[o["id"]] = rec
    cutoff = (datetime.now(timezone.utc) - timedelta(days=400)).strftime("%Y-%m-%d")
    hist = {k: v for k, v in hist.items() if v["till"] >= cutoff}
    HISTORY.parent.mkdir(exist_ok=True)
    HISTORY.write_text(json.dumps(hist, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"{len(hist)} offerte nello storico ({HISTORY})")


def cmd_artifact(out):
    data = get_offers()
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    body = html.split("<!--APP-START-->", 1)[1].split("<!--APP-END-->", 1)[0]
    body = body.replace("</head>\n<body>\n", "")
    match_js = (ROOT / "match.js").read_text(encoding="utf-8").replace("</", "<\\/")
    body = body.replace('<script src="match.js"></script>', "<script>\n" + match_js + "</script>", 1)
    embedded = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    body = body.replace("/*__EMBEDDED__*/", f"window.EMBEDDED_OFFERS = {embedded};", 1)
    hist = json.dumps(load_history(), ensure_ascii=False, sort_keys=True, separators=(",", ":")).replace("</", "<\\/")
    body = body.replace("/*__EMBEDDED_HISTORY__*/", f"window.EMBEDDED_HISTORY = {hist};", 1)
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    Path(out).write_text(body, encoding="utf-8")
    print(f"Scritto {out} ({len(data['offers'])} offerte)")


def main(argv):
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
    elif argv[0] == "aggiorna":
        print(f"{len(get_offers(force=True)['offers'])} offerte scaricate")
    elif argv[0] == "storico":
        cmd_storico()
    elif argv[0] == "artifact":
        cmd_artifact(argv[1] if len(argv) > 1 else "dist/avis-tilbud.html")
    else:
        print(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
