# Avis Tilbud

Confronta le offerte dei volantini di **Lidl, Føtex, Bilka, Netto e REMA 1000** con la tua lista della spesa, per spendere il meno possibile.

I dati vengono dall'API pubblica di eTilbudsavis/Tjek (`squid-api.tjek.com`), la stessa usata dall'app eTilbudsavis: nessuna chiave o registrazione.

## Installazione su iPhone e Mac (una volta sola)

1. Su GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**, scegli `claude/eloquent-franklin-9e2ymb` e `/ (root)`, poi *Save*. Dopo un minuto l'app è su **https://frankdinapoli.github.io/Avis/**.
2. **iPhone**: apri il link in Safari → Condividi → *Aggiungi alla schermata Home*.
3. **Mac**: apri il link in Safari → File → *Aggiungi al Dock*.

## Aggiornamento automatico

Ogni volta che apri l'app (o torni su di essa, e ogni 30 minuti mentre è aperta) controlla l'elenco dei volantini di ogni catena. Scarica di nuovo le offerte solo dei negozi il cui volantino è cambiato o scaduto, e programma da sola il controllo successivo alla prossima data di inizio o fine di un volantino. Se sei offline usa le offerte salvate. Il pulsante di aggiornamento resta disponibile per forzare il download.

## App web (`index.html`)

- Scrivi la lista, un prodotto per riga, in danese o in italiano (`latte` → `mælk`, `pollo` → `kylling`, …).
- `2x kaffe` indica la quantità, `ost -flødeost` esclude una parola, `hakket|fars` accetta l'una o l'altra.
- Per ogni prodotto vedi le offerte ordinate per prezzo (o per prezzo al kg/l). Tocca un'offerta per sceglierla.
- **Dove comprare** mostra in quale negozio conviene prendere ogni prodotto e il totale.
- **Tutto in un negozio** mostra quanti prodotti trovi in ogni catena e quanto spenderesti andando solo lì.
- Puoi escludere i negozi dove non vai. Lista e impostazioni restano salvate nel browser; le offerte vengono riscaricate ogni 6 ore (o con "Aggiorna offerte").

### Come funziona la ricerca

Il codice è in `match.js` (con il dizionario italiano → danese e i falsi amici). Prima la pertinenza, poi il prezzo:

- In danese il prodotto è l'ultima parola della frase (`Samsø nemme kartofler` sono patate, non formaggio) e in una parola composta è la fine (`hytteost` è formaggio, `ostehaps` no). I titoli si dividono su `eller`, `og`, `,`, `/`, `&`, `+`; quello che segue `med`, `i`, `til`, `af`, `uden` è un ingrediente, quindi solo *correlato*.
- Forme come `kyllingebrystfilet` valgono come `kyllingebryst`; il pålæg (affettati), i menu, le offerte condizionate e le unità diverse da quella dominante (kaffe: kg, non stk) diventano *correlato*.
- Quantità ovunque nella riga: `500g kyllingebryst`, `1,5 l mælk`, `6 stk æg`, `2x kaffe`. Con una quantità le offerte sono ordinate per costo stimato (confezioni necessarie × prezzo, o prezzo al kg × quantità se il formato varia) e mostrano ad es. `500 g ≈ 36,00 kr`.
- Refusi tollerati solo su parole intere, mai sulla fine di un composto.

Test: `node tests/run.mjs` (casi in `tests/cases.json`, offerte congelate in `tests/fixture.json`).

## Da terminale (`avis.py`)

Serve solo Python 3, nessuna dipendenza.

```sh
python3 avis.py aggiorna            # riscarica le offerte (cache in data/, 6 ore)
python3 avis.py storico             # aggiunge le offerte attuali a data/history.json
python3 avis.py artifact out.html   # copia di index.html con offerte e match.js incorporati
```

## Note

- I prezzi al kg/l sono stimati dalle quantità indicate nel volantino ("da" quando il formato varia).
- Alcune offerte valgono solo con app fedeltà (Lidl Plus, Coop, føtex plus) o hanno limiti per cliente: leggi la descrizione.
