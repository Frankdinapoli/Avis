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

In danese le parole composte finiscono con il prodotto vero e proprio: `hytteost` è un formaggio, `ostehaps` no. Per questo un'offerta conta come "il prodotto" se la parola cercata è una parola intera o la fine di una parola composta. Se la parola cercata è solo all'inizio (`mælkechokolade`), l'offerta viene mostrata come *correlato* e non viene scelta in automatico. Alcuni falsi amici (`pålæg` per `æg`, `frost` per `ost`, …) sono esclusi; li trovi in `index.html` insieme al dizionario italiano → danese.

## Da terminale (`avis.py`)

Serve solo Python 3, nessuna dipendenza.

```sh
python3 avis.py lista-esempio.txt   # confronta la lista
python3 avis.py cerca kaffe         # cerca tra tutte le offerte
python3 avis.py aggiorna            # riscarica le offerte (cache in data/, 6 ore)
python3 avis.py artifact out.html   # copia di index.html con le offerte incorporate
```

Aggiungi `--desc` per cercare anche nella descrizione delle offerte.

## Note

- I prezzi al kg/l sono stimati dalle quantità indicate nel volantino ("da" quando il formato varia).
- Alcune offerte valgono solo con app fedeltà (Lidl Plus, Coop, føtex plus) o hanno limiti per cliente: leggi la descrizione.
