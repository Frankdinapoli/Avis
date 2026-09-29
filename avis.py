#!/usr/bin/env python3
"""Offerte dei volantini danesi (Lidl, Føtex, Bilka, Netto, REMA 1000) da terminale.

Uso:
  python avis.py lista.txt          confronta la lista della spesa (un prodotto per riga)
  python avis.py cerca kaffe        cerca tra tutte le offerte
  python avis.py aggiorna           scarica di nuovo le offerte
  python avis.py artifact [out]     crea una copia di index.html con le offerte incorporate

Solo libreria standard, nessuna dipendenza.
"""
import json
import re
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
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


def load_dictionary():
    """Italian→Danish translations and false friends, shared with index.html."""
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    m = re.search(r'<script id="dizionario" type="application/json">(.*?)</script>', html, re.S)
    data = json.loads(m.group(1))
    return data["traduzioni"], data["falsi_amici"]


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


def fetch_store(store_id):
    out = []
    for offset in range(0, 5000, 100):
        url = f"{API}?dealer_ids={store_id}&limit=100&offset={offset}"
        with urllib.request.urlopen(url, timeout=30) as r:
            page = json.load(r)
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


def parse_date(s):
    return datetime.strptime(s, "%Y-%m-%dT%H:%M:%S%z")


def visible(offers):
    now = datetime.now(timezone.utc)
    return [o for o in offers if o["s"] and o["p"] is not None and parse_date(o["till"]) >= now]


def parse_line(line, dictionary):
    text, qty = line.strip(), 1
    m = re.match(r"^(\d+)\s*[x×*]?\s+(.+)$", text, re.I) or None
    if m:
        qty, text = int(m.group(1)), m.group(2)
    else:
        m = re.match(r"^(.+?)\s+[x×*]\s*(\d+)$", text, re.I)
        if m:
            text, qty = m.group(1), int(m.group(2))
    phrase = " ".join(text.lower().split())
    if phrase in dictionary:
        words = [dictionary[phrase]]
    else:
        words = [w if w.startswith("-") else dictionary.get(w, w) for w in phrase.split()]
    pos, neg = [], []
    for w in words:
        if w.startswith("-") and len(w) > 1:
            neg.append(w[1:])
        else:
            pos.append([a for a in w.split("|") if a])
    return {"text": text, "qty": qty, "pos": pos, "neg": neg}


SUFFIX = "(?:e|er|en|et|ne|erne|s)?"


def term_tier(term, words, text, false_friends):
    """1 = whole word or end of a compound (the product itself), 2 = start of a compound, 0 = none."""
    if " " in term:
        return 1 if term in text else 0
    ff = false_friends.get(term, [])
    whole = re.compile("^" + re.escape(term) + SUFFIX + "$")
    best = 0
    for w in words:
        if any(w.startswith(f) or w.endswith(f) for f in ff):
            continue
        if whole.match(w) or (len(term) >= 3 and w.endswith(term)):
            return 1
        if w.startswith(term):
            best = 2
    return best


def tier_in(text, q, false_friends):
    lower = text.lower()
    if any(n in lower for n in q["neg"]):
        return 0
    words = [w for w in re.split(r"[^\w]+", lower) if w]
    worst = 1
    for alts in q["pos"]:
        tiers = [t for t in (term_tier(a, words, lower, false_friends) for a in alts) if t]
        if not tiers:
            return 0
        worst = max(worst, min(tiers))
    return worst


def match_tier(o, q, false_friends, desc=False):
    """0 = no match, 1 = the product, 2 = related, 3 = only in the description."""
    if not q["pos"]:
        return 0
    t = tier_in(o["h"], q, false_friends)
    if t or not desc or any(n in o["h"].lower() for n in q["neg"]):
        return t
    return 3 if tier_in(o["d"], q, false_friends) else 0


def find(offers, q, false_friends, desc=False):
    hits = [(match_tier(o, q, false_friends, desc), o) for o in offers]
    return sorted(((t, o) for t, o in hits if t), key=lambda x: (x[0], x[1]["p"]))


def unit_price(o):
    if not (o["u"] and o["f"] and o["sf"]):
        return None
    amount = (o["st"] or o["sf"]) * o["f"] * (o["pc"] or 1)
    unit = "stk" if o["u"] == "pcs" else o["u"]
    return (o["p"] / amount, unit) if amount > 0 else None


def kr(n):
    return f"{n:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def describe(o):
    up = unit_price(o)
    unit = f"  ({kr(up[0])} kr/{up[1]})" if up else ""
    start = parse_date(o["from"])
    when = f"dal {start:%d/%m}" if start > datetime.now(timezone.utc) else f"fino al {parse_date(o['till']):%d/%m}"
    return f"{kr(o['p']):>9} kr  {NAMES[o['s']]:<9}  {o['h']}{unit}  [{when}]"


def cmd_list(path, desc=False):
    dictionary, false_friends = load_dictionary()
    offers = visible(get_offers()["offers"])
    lines = [l for l in Path(path).read_text(encoding="utf-8").splitlines() if l.strip() and not l.strip().startswith("#")]
    total, by_store, missing = 0.0, {}, []
    for line in lines:
        q = parse_line(line, dictionary)
        found = find(offers, q, false_friends, desc)
        label = f"{q['qty']}× {q['text']}" if q["qty"] > 1 else q["text"]
        print(f"\n== {label}")
        for t, o in found[:5]:
            print("  " + describe(o) + ("  (simile)" if t > 1 else ""))
        if not found or found[0][0] > 1:
            print("   nessuna offerta esatta" if found else "   nessuna offerta")
            missing.append(q["text"])
            continue
        best = found[0][1]
        total += best["p"] * q["qty"]
        by_store.setdefault(best["s"], []).append((q, best))
    print("\n" + "=" * 60 + "\nDOVE COMPRARE")
    for key, rows in by_store.items():
        sub = sum(o["p"] * q["qty"] for q, o in rows)
        print(f"\n{NAMES[key]}  ({kr(sub)} kr)")
        for q, o in rows:
            print(f"   {kr(o['p'] * q['qty']):>9}  {o['h']}")
    print(f"\nTOTALE: {kr(total)} kr")
    if missing:
        print("Senza offerta: " + ", ".join(missing))


def cmd_search(words, desc=False):
    dictionary, false_friends = load_dictionary()
    q = parse_line(" ".join(words), dictionary)
    found = find(visible(get_offers()["offers"]), q, false_friends, desc)
    for t, o in found:
        print(describe(o) + ("  (simile)" if t > 1 else ""))
    if not found:
        print("Nessuna offerta.")


def cmd_artifact(out):
    data = get_offers()
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    body = html.split("<!--APP-START-->", 1)[1].split("<!--APP-END-->", 1)[0]
    body = body.replace("</head>\n<body>\n", "")
    embedded = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    body = body.replace("/*__EMBEDDED__*/", f"window.EMBEDDED_OFFERS = {embedded};", 1)
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    Path(out).write_text(body, encoding="utf-8")
    print(f"Scritto {out} ({len(data['offers'])} offerte)")


def main(argv):
    desc = "--desc" in argv
    argv = [a for a in argv if a != "--desc"]
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
    elif argv[0] == "aggiorna":
        print(f"{len(get_offers(force=True)['offers'])} offerte scaricate")
    elif argv[0] == "cerca" and len(argv) > 1:
        cmd_search(argv[1:], desc)
    elif argv[0] == "artifact":
        cmd_artifact(argv[1] if len(argv) > 1 else "dist/avis-tilbud.html")
    else:
        cmd_list(argv[0], desc)


if __name__ == "__main__":
    main(sys.argv[1:])
