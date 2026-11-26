# Meridia Statistics

A national statistics site for the fictional Republic of Meridia: population, economy, labour, prices, trade, regions, open-data downloads and methods. All figures form one internally consistent demonstration dataset (2015–2025) held in `app/data.js`.

## Run

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

The site is plain static files under `app/` (HTML, CSS, ES modules) with no build step and no network requests. Charts are hand-drawn SVG generated from the data in the browser. Controls that work: indicator search, hash-route navigation, chart line/bar toggle, sortable tables, partner filter, inflation calculator, topic-filtered CSV downloads (generated client-side), and a responsive phone layout.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts` (left byte-for-byte as shipped in the kit).

## License

MIT — see `LICENSE`.
