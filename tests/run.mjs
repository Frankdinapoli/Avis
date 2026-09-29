// Matching regression tests: `node tests/run.mjs` (no dependencies).
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const M = require("../match.js");
const dir = new URL(".", import.meta.url);
const pool = JSON.parse(readFileSync(new URL("fixture.json", dir), "utf8")).offers;
const cases = JSON.parse(readFileSync(new URL("cases.json", dir), "utf8"));
const lc = s => s.toLowerCase();
let pass = 0;
for (const c of cases) {
  const q = M.parseLine(c.q), found = M.findOffers(pool, q, {});
  const top = found[0] && found[0]._tier === 1 ? found[0] : null, errs = [];
  if (c.top && !(top && lc(top.h).includes(lc(c.top)))) errs.push(`top is "${top ? top.h : "none"}", wanted "${c.top}"`);
  for (const bad of c.notTier1 || []) {
    const hit = found.find(o => o._tier === 1 && lc(o.h).includes(lc(bad)));
    if (hit) errs.push(`"${hit.h}" must not be tier 1`);
  }
  if (c.topUnit && !(top && M.unitPrice(top) && M.unitPrice(top).unit === c.topUnit)) errs.push(`top unit is not ${c.topUnit}`);
  if (c.est && !(top && top._est)) errs.push("no cost estimate on top pick");
  if (c.qty && q.qty !== c.qty) errs.push(`qty ${q.qty}, wanted ${c.qty}`);
  if (c.est && q.pos.flat().join(" ").match(/\d/)) errs.push("quantity left in search terms");
  if (errs.length) console.log(`FAIL ${c.q}\n   ` + errs.join("\n   ")); else { pass++; console.log(`ok   ${c.q}  ->  ${top ? top.h : "-"}`); }
}
console.log(`\n${pass}/${cases.length} passed`);
process.exit(pass === cases.length ? 0 : 1);
