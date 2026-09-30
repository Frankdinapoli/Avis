/* Avis Tilbud: offer matching (Danish-aware). Plain script: defines global AvisMatch, and module.exports under node. */(function (root) {  "use strict";  var DATA = 
{
 "traduzioni": {
  "latte": "mælk", "latte intero": "sødmælk", "latte parzialmente scremato": "letmælk", "panna": "fløde",
  "uova": "æg", "uovo": "æg", "burro": "smør", "formaggio": "ost", "mozzarella": "mozzarella",
  "parmigiano": "parmesan", "yogurt": "yoghurt", "pane": "brød", "pane di segale": "rugbrød",
  "caffè": "kaffe", "caffe": "kaffe", "tè": "te", "zucchero": "sukker", "farina": "mel", "sale": "salt",
  "olio": "olie", "olio d'oliva": "olivenolie", "aceto": "eddike", "riso": "ris", "pasta": "pasta",
  "pomodori": "tomat", "pomodoro": "tomat", "passata": "hakkede tomater|passata", "patate": "kartofler",
  "cipolle": "løg", "cipolla": "løg", "aglio": "hvidløg", "carote": "gulerødder", "insalata": "salat",
  "cetrioli": "agurk", "cetriolo": "agurk", "peperoni": "peberfrugt", "zucchine": "squash", "funghi": "champignon|svampe",
  "broccoli": "broccoli", "mele": "æbler", "mela": "æble", "banane": "bananer", "arance": "appelsiner",
  "limoni": "citroner", "uva": "vindruer", "fragole": "jordbær", "pere": "pærer", "avocado": "avocado",
  "pollo": "kylling", "petto di pollo": "kyllingebryst", "manzo": "okse", "maiale": "gris|svin",
  "carne macinata": "hakket oksekød|hakket okse|hakket grisekød|hakket gris|hakket svinekød|hakket kalvekød|hakket kalv|hakket kyllingekød|hakket kylling|hakket kød|hakkekød|fars", "hakkekød": "hakket oksekød|hakket okse|hakket grisekød|hakket gris|hakket svinekød|hakket kalvekød|hakket kalv|hakket kyllingekød|hakket kylling|hakket kød|hakkekød|fars", "hakkekod": "hakket oksekød|hakket okse|hakket grisekød|hakket gris|hakket svinekød|hakket kalvekød|hakket kalv|hakket kyllingekød|hakket kylling|hakket kød|hakkekød|fars", "fars": "hakket oksekød|hakket okse|hakket grisekød|hakket gris|hakket svinekød|hakket kalvekød|hakket kalv|hakket kyllingekød|hakket kylling|hakket kød|hakkekød|fars",
  "svinekød": "grisekød|svinekød", "grisekød": "grisekød|svinekød", "oksekød": "oksekød", "macinato": "hakket oksekød|hakket okse|hakket grisekød|hakket gris|hakket svinekød|hakket kalvekød|hakket kalv|hakket kyllingekød|hakket kylling|hakket kød|hakkekød|fars", "salsiccia": "pølse", "salsicce": "pølser",
  "prosciutto": "skinke", "pancetta": "bacon", "salmone": "laks", "tonno": "tun", "pesce": "fisk",
  "gamberi": "rejer", "birra": "øl", "vino": "vin", "vino rosso": "rødvin", "vino bianco": "hvidvin",
  "acqua": "vand", "succo": "juice", "cioccolato": "chokolade", "biscotti": "kiks|småkager",
  "cereali": "morgenmad|müsli|cornflakes", "detersivo": "vaskemiddel", "carta igienica": "toiletpapir",
  "carta da cucina": "køkkenrulle", "pannolini": "bleer", "shampoo": "shampoo", "dentifricio": "tandpasta",
  "surgelati": "frost", "gelato": "is|flødeis", "pizza": "pizza", "noci": "nødder", "miele": "honning",
  "marmellata": "marmelade", "lievito": "gær", "legumi": "bønner|linser", "fagioli": "bønner", "ceci": "kikærter",
  "coca": "coca-cola",
  "coca cola": "coca-cola",
  "cocacola": "coca-cola",
  "coke": "coca-cola",
  "cola": "cola",
  "sprite": "sprite",
  "fanta": "fanta",
  "pepsi": "pepsi",
  "nutella": "nutella",
  "barilla": "barilla",
  "philadelphia": "philadelphia",
  "carta forno": "bagepapir",
  "carta da forno": "bagepapir",
  "pellicola": "husholdningsfilm|film",
  "pellicola trasparente": "husholdningsfilm",
  "alluminio": "alufolie",
  "carta stagnola": "alufolie",
  "spugne": "svampe|skuresvamp",
  "spugna": "skuresvamp|svamp",
  "sapone": "sæbe",
  "bagnoschiuma": "shower|bodywash|badeskum",
  "doccia schiuma": "shower|bodywash",
  "deodorante": "deodorant",
  "assorbenti": "bind|menstruationsbind",
  "cracker": "kiks|crackers",
  "crackers": "kiks|crackers",
  "patatine": "chips",
  "bibite": "sodavand",
  "bibita": "sodavand",
  "gassosa": "sodavand",
  "aranciata": "appelsinsodavand|sodavand",
  "succo d'arancia": "appelsinjuice",
  "succo di arancia": "appelsinjuice",
  "succo di mela": "æblejuice",
  "spremuta": "juice",
  "kafe": "kaffe",
  "tonno in scatola": "tun",
  "latte di soia": "sojadrik|sojamælk",
  "latte di avena": "havredrik|havremælk",
  "latte di mandorla": "mandeldrik",
  "panna da cucina": "madlavningsfløde",
  "panna montata": "piskefløde",
  "ketchup": "ketchup",
  "maionese": "mayonnaise",
  "senape": "sennep",
  "pesto": "pesto",
  "tagliatelle": "pasta",
  "spaghetti": "spaghetti",
  "penne": "penne|pasta",
  "sugo": "pastasauce|tomatsauce",
  "olive": "oliven",
  "mais": "majs",
  "piselli": "ærter",
  "spinaci": "spinat",
  "zucca": "græskar",
  "melanzane": "aubergine",
  "cavolo": "kål",
  "cavolfiore": "blomkål",
  "lattuga": "salat",
  "basilico": "basilikum",
  "prezzemolo": "persille",
  "rosmarino": "rosmarin",
  "pepe": "peber",
  "spezie": "krydderi",
  "farina 00": "hvedemel",
  "pancarrè": "toastbrød",
  "toast": "toastbrød",
  "fette biscottate": "knækbrød",
  "grissini": "grissini|brødstænger",
  "cornflakes": "cornflakes",
  "salame": "salami",
  "mortadella": "pålæg",
  "wurstel": "pølser",
  "hamburger": "burger|bøf",
  "bistecca": "bøf|steak",
  "tacchino": "kalkun",
  "agnello": "lam",
  "merluzzo": "torsk",
  "acciughe": "ansjoser",
  "vodka": "vodka",
  "prosecco": "prosecco|mousserende",
  "spumante": "mousserende",
  "acqua frizzante": "danskvand|kildevand",
  "acqua minerale": "kildevand|mineralvand",
  "tovaglioli": "servietter",
  "sacchetti": "poser",
  "sacchetti spazzatura": "affaldsposer",
  "candeggina": "klor",
  "ammorbidente": "skyllemiddel",
  "lavastoviglie": "opvask|maskinopvask",
  "piatti": "opvask",
  "sgrassatore": "rengøring",
  "detergente": "rengøring",
  "batterie": "batterier",
  "lampadine": "pærer|led",
  "carta": "papir",
  "penne bic": "kuglepen",
  "gomma da masticare": "tyggegummi",
  "caramelle": "bolsjer|slik",
  "gelatina": "gelé",
  "panettone": "kage",
  "torta": "kage",
  "budino": "budding",
  "tè freddo": "iste",
  "ice tea": "iste",
  "caffè macinato": "formalet kaffe",
  "caffè in grani": "kaffebønner",
  "capsule": "kapsler",
  "rasoi": "barberblade|barbermaskine",
  "cotton fioc": "vatpinde",
  "cotone": "vat",
  "crema": "creme",
  "crema solare": "solcreme",
  "balsamo": "balsam",
  "sapone liquido": "håndsæbe",
  "gel doccia": "shower|bodywash"
 },
 "falsi_amici": {
  "æg": ["pålæg"], "ost": ["frost", "kost", "post", "rost", "leverpostej"], "vin": ["svin"],
  "løg": ["hvidløg"], "mel": ["karamel", "kamel"], "ris": ["pris", "gris", "paris"], "is": ["ris", "pris", "gris"],
  "te": ["kotelet"], "øl": ["bøl"], "mælk": ["kokosmælk", "havremælk", "mandelmælk", "sojamælk", "kakao", "chokolade", "kærnemælk"]
 }
}
;
  var DICT = DATA.traduzioni, FALSE_FRIENDS = DATA.falsi_amici;

  var norm = function (s) { return s.toLowerCase().replace(/\s+/g, " ").trim(); };
  // Comparison form: case, accents and Danish spelling variants folded (ø/oe->o, æ/ae->e, å/aa->a).
  var fold = function (s) {
    return s.toLowerCase().replace(/æ/g, "e").replace(/ø/g, "o").normalize("NFD").replace(/\p{M}/gu, "")
      .replace(/ae/g, "e").replace(/oe/g, "o").replace(/aa/g, "a");
  };
  var FF = {};
  for (var k in FALSE_FRIENDS) FF[fold(k)] = FALSE_FRIENDS[k].map(fold);
  ["boost", "booster"].forEach(function (w) { (FF.ost = FF.ost || []).push(w); });
  var cleanAlt = function (a) { return fold(a).replace(/[^\p{L}\p{N}]+/gu, " ").trim(); };
  var altsOf = function (v) { return v.split("|").map(cleanAlt).filter(Boolean); };

  // ---- small Danish lexicon (folded at load) ----
  // A heading word that is a known kind of X counts as X ("Danbo eller Samsø" is ost).
  var CAT_SRC = {
    ost: "samsø danbo havarti gouda brie feta cheddar mozzarella parmesan esrom rygeost edamer emmentaler camembert mascarpone ricotta maasdam tilsiter grana parmigiano",
    mælk: "letmælk sødmælk skummetmælk minimælk kærnemælk",
    pasta: "spaghetti penne fusilli tagliatelle fettuccine farfalle rigatoni",
    øl: "pilsner lager"
  };
  var CAT = {};
  Object.keys(CAT_SRC).forEach(function (c) {
    CAT_SRC[c].split(" ").forEach(function (w) { var f = fold(w); (CAT[f] = CAT[f] || []).push(fold(c)); });
  });
  // Heading words that make the rest a modifier, not the product.
  var PREPS = { med: 1, i: 1, til: 1, af: 1, uden: 1 };
  var ADJ = {};
  ("okologisk okologiske oko frisk friske danske dansk flere varianter forskellige udvalgte original classic gold zero light " +
   "naturel hele hel store stor sma lille mini ny nye").split(" ").forEach(function (w) { ADJ[w] = 1; });
  // Query words that only qualify a product ("coca cola zero"): ignored when other words are present.
  var SOFT = { zero: 1, light: 1, classic: 1, original: 1 };
  // Compounds "<prefix><term>" that are a different thing than the term (flower bulbs, cauliflower rice, soda, turkey bacon).
  var NOT_THE_TERM = { log: /^(blomster|tulipan|krokus|hyacint|narcis)$/, ris: /^(blomkals?|broccolis?)$/,
    vand: /^(soda)$/, bacon: /^(kalkun)$/ };
  // Processed / variant forms: related to the product, never the product itself (unless the query asks for them).
  var VARIANT_RE = /\b(indbagt\w*|panere\w*|fiskefrikadelle\w*|fiskepind\w*|fugtig\w*|marinere\w*|\w*mix|bbq)\b/;
  var PRE_FORM = { hakket: 1 }; // "hakket grisekød" is hakket (mince) even though the head is grisekød
  var UNITW = { g: 1, kg: 1, l: 1, ml: 1, cl: 1, dl: 1, stk: 1, pk: 1, ps: 1, pct: 1, x: 1, gr: 1 };
  var BRANDS = {};
  "nutella barilla philadelphia pepsi fanta sprite coca cola cocacola lavazza nescafe merrild arla lurpak gevalia".split(" ").forEach(function (w) { BRANDS[w] = 1; });
  var FORM_RE = new RegExp("^e?(?:filet|fileter|inderfilet|inderfileter|brystfilet|stykker|tern|strimler|bryst|lar|vinger|kod|bonner|mix)$");
  var FLAVOR_RE = /(kakao|chokolade|jordbaer|vanilje|banan|karamel|lakrids|smag)/;
  var COLDCUT = /(paleg|bacon|skinke|salami|pate|leverpostej|skive|hamburgerryg|rullepolse|mortadella|kalkun)/;
  var STRONG_RE = /\b(bistro|menu|kombi\w*|velg mellem|ved kob af (?!flere|mere|mindst|\d)|nar du kober)\b/;

  // ---- query parsing ----
  var AMT_RE = /(^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(kg|gr|g|liter|ltr|ml|cl|dl|l|stk|pcs|pk)(?![\p{L}\d])/iu;
  function parseAmount(text) {
    var m = text.match(AMT_RE);
    if (!m) return { text: text, amount: null };
    var v = parseFloat(m[2].replace(",", ".")), u = m[3].toLowerCase(), unit;
    if (u === "kg") unit = "kg"; else if (u === "g" || u === "gr") { v /= 1000; unit = "kg"; }
    else if (u === "ml") { v /= 1000; unit = "l"; } else if (u === "cl") { v /= 100; unit = "l"; } else if (u === "dl") { v /= 10; unit = "l"; }
    else if (u === "l" || u === "liter" || u === "ltr") unit = "l"; else unit = "pcs";
    if (!(v > 0)) return { text: text, amount: null };
    var rest = text.slice(0, m.index) + m[1] + " " + text.slice(m.index + m[0].length);
    return { text: rest.replace(/\s+/g, " ").trim(), amount: { v: v, unit: unit } };
  }

  function parseLine(line) {
    var text = line.trim(), qty = 1, m;
    var pa = parseAmount(text); text = pa.text;
    if ((m = text.match(/(?:^|\s)(\d+)\s*[x×*](?=\s|$)/i))) { qty = +m[1]; text = text.replace(m[0], " "); }
    else if ((m = text.match(/(?:^|\s)[x×*]\s*(\d+)(?=\s|$)/i))) { qty = +m[1]; text = text.replace(m[0], " "); }
    else if ((m = text.match(/^(\d+)\s+(.+)$/))) { qty = +m[1]; text = m[2]; }
    text = text.replace(/\s+/g, " ").trim();
    var phrase = norm(text), pos = [], neg = [], hits = [];
    var lookup = function (k) { return DICT[k] || DICT[k.normalize("NFC")]; };
    var dict = function (k) { var v = lookup(k); if (v && hits.indexOf(v) < 0) hits.push(v); return v; };
    if (dict(phrase)) pos.push(altsOf(dict(phrase)));
    else phrase.split(" ").forEach(function (tok) {
      if (!tok) return;
      if (SOFT[fold(tok)] && phrase.indexOf(" ") > 0) return;
      if (tok[0] === "-") { fold(tok).split(/[^\p{L}\p{N}]+/u).filter(Boolean).forEach(function (n) { neg.push(n); }); return; }
      var whole = dict(tok);
      if (whole) { pos.push(altsOf(whole)); return; }
      tok.split(/[^\p{L}\p{N}|]+/u).filter(Boolean).forEach(function (sw) {
        var alts = sw.split("|").filter(Boolean);
        if (!alts.length) return;
        pos.push(alts.length === 1 && dict(alts[0]) ? altsOf(dict(alts[0]))
          : alts.map(function (a) { return dict(a) ? altsOf(dict(a)) : [cleanAlt(a)]; }).reduce(function (x, y) { return x.concat(y); }, []).filter(Boolean));
      });
    });
    var said = cleanAlt(text);
    var shown = hits.filter(function (v) { return !altsOf(v).every(function (a) { return said.indexOf(a) >= 0; }); });
    var flat = pos.reduce(function (x, y) { return x.concat(y); }, []).join(" ");
    return { raw: line.trim(), text: text, qty: qty, amount: pa.amount, translated: shown.length ? shown.map(function (v) { var a = v.split("|"); return a.length > 2 ? a[0] + " …" : a.join(" o "); }).join(" ") : null,
      pos: pos, neg: neg, key: norm(line), coldcut: COLDCUT.test(flat) };
  }

  // ---- word / term matching ----
  var SUFFIX = "(?:e|er|en|et|ne|erne|s|r)?";
  var reCache = {};
  function within1(a, b) {
    if (a === b) return true;
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    var i = 0;
    if (la === lb) {
      while (i < la && a[i] === b[i]) i++;
      return a.slice(i + 1) === b.slice(i + 1) || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
    }
    var s = la < lb ? a : b, l = la < lb ? b : a;
    while (i < s.length && s[i] === l[i]) i++;
    return s.slice(i) === l.slice(i + 1);
  }
  var esc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };

  // 0 no match; 1 the word is the term (whole, compound end, form suffix, known kind); 1.5 whole-word typo; 2 related (compound start).
  function wordTier(term, w) {
    var ff = FF[term];
    if (ff && ff.some(function (f) { return w.indexOf(f) === 0 || w.slice(-f.length) === f; })) return 0;
    var re = reCache[term] || (reCache[term] = new RegExp("^" + esc(term) + SUFFIX + "$"));
    if (re.test(w)) return 1;
    if (CAT[w] && CAT[w].indexOf(term) >= 0) return 1;
    if (term.length >= 3 && w.length > term.length) {
      if (w.slice(-term.length) === term) {
        if (NOT_THE_TERM[term] && NOT_THE_TERM[term].test(w.slice(0, w.length - term.length))) return 2;
        // "kakaoskummetmælk" is chocolate milk, not plain milk
        return /melk$/.test(term) && FLAVOR_RE.test(w.slice(0, w.length - term.length)) && !FLAVOR_RE.test(term) ? 2 : 1;
      }
      if (w.indexOf(term) === 0) return FORM_RE.test(w.slice(term.length)) ? 1 : 2;
    }
    if (term.length >= 5 && w[0] === term[0] && within1(term, w)) return 1.5;
    return 0;
  }

  // Splits a heading into alternatives ("A eller B, C"), each with word list, head index and ingredient zone start.
  function analyse(heading) {
    var brandTok = (heading.split(/\s+/)[0] || "").replace(/[^\p{L}]/gu, "");
    var brand = brandTok.length >= 3 && brandTok === brandTok.toUpperCase() && brandTok !== brandTok.toLowerCase() ? fold(brandTok) : null;
    var parts = fold(heading).replace(/\([^)]*\)/g, " ").split(/\s+(?:eller|og)\s+|[,\/&+]/);
    return parts.map(function (p, pi) {
      var toks = p.split(/\s+/).filter(function (t) { return t && t[0] !== "-"; })
        .map(function (t) { return t.replace(/[^\p{L}\p{N}]+/gu, " ").trim(); }).join(" ").split(" ")
        .filter(function (t) { return t && !/^\d/.test(t) && !UNITW[t]; });
      var zone = toks.length;
      for (var i = 1; i < toks.length; i++) if (PREPS[toks[i]]) { zone = i; break; }
      var head = zone - 1;
      while (head > 0 && ADJ[toks[head]]) head--;
      return { w: toks, head: Math.max(head, 0), zone: zone, text: " " + toks.join(" ") + " ", brand: pi === 0 ? brand : null };
    }).filter(function (a) { return a.w.length; });
  }

  // "Samsø skiveost": samsø is a kind of ost and the head is ost
  function kindOfHead(term, alt) {
    var cats = CAT[term], h = alt.w[alt.head];
    return !!cats && cats.some(function (c) { return wordTier(c, h) === 1; });
  }
  function termInAlt(term, alt, isHead) {
    if (term.indexOf(" ") >= 0) {
      if (alt.text.indexOf(term) >= 0) return 1;
      var j = term.replace(/ /g, "");
      return j.length >= 3 ? termInAlt(j, alt, isHead) : 0;
    }
    var best = 0;
    var consider = function (m, i, joined) {
      if (!m) return;
      if (i >= alt.zone) m = Math.max(m, 2);
      else if (isHead && i !== alt.head && !BRANDS[term] && !PRE_FORM[term] && !kindOfHead(term, alt) && !(alt.brand === term && i === 0)) m = Math.max(m, 2);
      if (!best || m < best) best = m;
    };
    for (var i = 0; i < alt.w.length; i++) {
      consider(wordTier(term, alt.w[i]), i);
      if (i + 1 < alt.w.length && alt.w[i] + alt.w[i + 1] === term) consider(1, i + 1); // "rug brød" ~ "rugbrød"
    }
    return best;
  }
  function scoreGroups(groups, alt) {
    var worst = 1;
    for (var g = 0; g < groups.length; g++) {
      var t = 0, isHead = g === groups.length - 1;
      for (var a = 0; a < groups[g].length; a++) { var x = termInAlt(groups[g][a], alt, isHead); if (x && (!t || x < t)) t = x; }
      if (!t) return 0;
      worst = Math.max(worst, t);
    }
    return worst;
  }
  function scoreAlts(groups, alts) {
    var best = 0;
    alts.forEach(function (alt) { var s = scoreGroups(groups, alt); if (s && (!best || s < best)) best = s; });
    if (best) return best;
    // terms spread over different alternatives: only related
    var worst = 1;
    for (var g = 0; g < groups.length; g++) {
      var t = 0;
      alts.forEach(function (alt) { groups[g].forEach(function (a) { var x = termInAlt(a, alt, false); if (x && (!t || x < t)) t = x; }); });
      if (!t) return 0;
      worst = Math.max(worst, t);
    }
    return Math.max(worst, 2);
  }
  var wordsOf = function (t) { return fold(t).split(/[^\p{L}\p{N}]+/u).filter(Boolean); };

  var analysed = new Map();
  function analysedOf(h) { var a = analysed.get(h); if (!a) { a = analyse(h); if (analysed.size > 20000) analysed.clear(); analysed.set(h, a); } return a; }

  function tierIn(text, q) {
    var lower = fold(text).replace(/[^\p{L}\p{N}]+/gu, " ");
    if (q.neg.some(function (n) { return lower.indexOf(n) >= 0; })) return -1;
    var alts = analysedOf(text);
    var r = scoreAlts(q.pos, alts);
    // "coca cola" <-> "cocacola": also try joining adjacent query words
    for (var i = 0; !r && i + 1 < q.pos.length; i++) {
      var joined = [];
      q.pos[i].forEach(function (a) { q.pos[i + 1].forEach(function (b) { joined.push(a.replace(/ /g, "") + b.replace(/ /g, "")); }); });
      var s = scoreAlts(q.pos.slice(0, i).concat([joined], q.pos.slice(i + 2)), alts);
      if (s && (!r || s < r)) r = s;
    }
    return r;
  }

  // Heading-level adjustments: processed forms, meals and conditional deals are related, not the product.
  function adjust(o, q, t) {
    if (t <= 0 || t >= 2) return t;
    var h = fold(o.h), d = fold(o.d || "");
    if (!q.coldcut) {
      if (h.indexOf("paleg") >= 0) return 2;
      if (/\bskive[rt]\b/.test(h) && !/brod/.test(h)) return 2;
    }
    var qf = fold(q.text), vm = h.match(VARIANT_RE);
    if (vm && qf.indexOf(vm[1]) < 0) return 2;
    if (STRONG_RE.test(h) || STRONG_RE.test(d)) return 2;
    if (/ med /.test(" " + h.replace(/[^\p{L}\p{N}]+/gu, " ") + " ") && !/ med /.test(" " + fold(q.text) + " ")) return Math.min(t + 0.25, 1.99);
    return t;
  }
  function baseScore(o, q, opts) {
    if (!q.pos.length) return 0;
    var h = tierIn(o.h, q);
    if (h > 0) return adjust(o, q, h);
    if (h < 0 || !(opts && opts.desc)) return 0;
    return tierIn(o.d || "", q) > 0 ? 3 : 0;
  }
  function matchScore(o, q, opts) { return baseScore(o, q, opts); }
  function matchTier(o, q, opts) { return Math.floor(matchScore(o, q, opts)); }

  // ---- prices ----
  function unitPrice(o) {
    if (o.p == null || !o.u || !o.f || !o.sf) return null;
    var hi = (o.st || o.sf) * o.f * (o.pc || 1), lo = o.sf * o.f * (o.pc || 1);
    if (!(hi > 0)) return null;
    return { best: o.p / hi, worst: o.p / lo, unit: o.u === "pcs" ? "stk" : o.u };
  }
  // Estimated cost of the wanted amount: whole packs when the size is fixed, unit price when it varies.
  function estimate(o, a) {
    if (!a || o.p == null || !o.u || o.u !== a.unit || !o.f || !o.sf) return null;
    var lo = o.sf * o.f * (o.pc || 1), hi = (o.st || o.sf) * o.f * (o.pc || 1);
    if (!(lo > 0)) return null;
    if (hi - lo < 1e-9) { var packs = Math.max(1, Math.ceil(a.v / lo - 1e-9)); return { cost: packs * o.p, packs: packs, amount: a }; }
    return { cost: (o.p / ((lo + hi) / 2)) * a.v, packs: null, amount: a };
  }
  var unitClass = function (o) { return o.u ? (o.u === "pcs" ? "stk" : o.u) : (o.un || null); };

  // Pool + query -> matching offers, most relevant first, then cheapest (or cheapest for the wanted amount).
  // opts: { sort: "price" | "unit", desc: bool }. Each result carries _tier (1 product, 2 related, 3 description) and _est.
  function findOffers(pool, q, opts) {
    opts = opts || {};
    var unitSort = opts.sort === "unit", out = [];
    for (var i = 0; i < pool.length; i++) { var t = baseScore(pool[i], q, opts); if (t > 0) out.push({ o: pool[i], t: t }); }
    // unit consistency: the product is sold in one dominant unit; the others are something else
    var counts = {};
    out.forEach(function (x) { if (x.t < 2) { var c = unitClass(x.o); if (c) counts[c] = (counts[c] || 0) + 1; } });
    var cls = Object.keys(counts);
    if (cls.length > 1) {
      var want = q.amount && counts[q.amount.unit === "pcs" ? "stk" : q.amount.unit] ? (q.amount.unit === "pcs" ? "stk" : q.amount.unit) : null;
      var order = ["kg", "l", "stk"], dom = want || cls.sort(function (a, b) { return counts[b] - counts[a] || order.indexOf(a) - order.indexOf(b); })[0];
      out.forEach(function (x) { var c = x.t < 2 ? unitClass(x.o) : null; if (c && c !== dom) x.t = 2; });
    }
    out.forEach(function (x) { x.est = estimate(x.o, q.amount); });
    var key = function (x) {
      if (q.amount) return x.est ? x.est.cost : 1e9 + x.o.p;
      if (unitSort) { var u = unitPrice(x.o); return u ? u.best : Infinity; }
      return x.o.p;
    };
    out.sort(function (a, b) { return a.t - b.t || key(a) - key(b) || a.o.p - b.o.p; });
    return out.map(function (x) { return Object.assign(Object.create(x.o), { _tier: Math.floor(x.t), _est: x.est }); });
  }

  var api = { DICT: DICT, FALSE_FRIENDS: FALSE_FRIENDS, fold: fold, parseLine: parseLine, wordsOf: wordsOf, tierIn: tierIn,
    matchScore: matchScore, matchTier: matchTier, findOffers: findOffers, unitPrice: unitPrice, estimate: estimate };
  root.AvisMatch = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
