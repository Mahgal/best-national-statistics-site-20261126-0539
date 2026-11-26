# Build notes — Meridia Statistics

Entry for make.fun `best-national-statistics-site-20261126-0539` ("Make the best national statistics site"). Built 2026-11-26, after the competition opened (2026-11-26T05:39Z).

## Constraints taken from the kit (RULES.txt / competition.yaml / starter)

- Static site under `app/`, `app/index.html` opens on desktop and phone with **no network request**; every script/style/media is a file under `app/` or a `data:` URI.
- Original design, text, images and names — no real statistics-office brand is copied.
- `main.ts` at repo root copies `app/` + `screenshots/` to the output dir and writes `dossier.json` via `buildDossier` from `vendor/makefun-frontend.ts`, left byte-for-byte as shipped (sha256 `4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240`, verified against the kit starter).
- Caps from the starter: dossier text ≤ 163840 bytes, ≤ 4 screenshots each ≤ 262144 bytes, `app/` ≤ 993 files and ≤ 16 MiB.
- OSI license (starter MIT kept). Repo must be created after the opening; the GitHub remote is created by the main chat after this build — this build produced the local repository only. No bundle/submit was run in this build session.
- `main.ts` is the starter's, unchanged: it only `mkdirSync(out, {recursive:true})` and copies into it — no chmod on the output directory itself.

## Design

"Meridia Statistics", the national statistics office of the fictional Republic of Meridia. One internally consistent demonstration dataset (2015–2025) in `app/data.js`: population 8.42m→9.35m, GDP growth with a 2020 contraction and rebound, unemployment 7.4%→5.4%, inflation peaking at 6.9% in 2022, exports/imports by partner, seven regions whose populations sum to the national total (2.41+1.36+1.58+1.24+0.97+0.72+1.07 = 9.35m), CPI category weights summing to 100.0, sector shares summing to 100.0.

Pages (hash routes, every page reachable by link): Overview (KPI cards, growth/jobs chart, release list, theme tiles), Population (line/bar toggle, age pyramid, vital statistics, CSV download), Economy (GDP growth bars, sector donut, GDP per capita, sortable sector table), Labour, Prices (inflation chart, working inflation calculator, sortable CPI table), Trade (exports/imports chart, partner filter + sortable table with computed balances), Regions (region tiles + sortable comparison table), Data & downloads (topic filter; CSVs generated in-browser from the same figures), Methods (production methods, definitions, release calendar). Global indicator search in the header jumps to the right page. Charts are hand-drawn SVG from the data — no libraries, no external requests. Phone layout verified at 390×844.

## Evidence

- Deterministic double run: `MAKEFUN_OUTPUT_DIR=/tmp/out1 node main.ts` and `…=/tmp/out2 node main.ts` → `diff -r` reports the two output trees **identical**; `dossier.json` sha256 `ec4adee34a47c18e788298c16a60c4d9d40e90f890a3c08094ce7f997c5eaf60` in both runs.
- `app/`: 4 files, 32098 bytes. Screenshots: 4 PNGs, each ≤ 262144 bytes (218714 / 71116 / 80494 / 61005).
- Screenshots are real headless-Chromium renders of this site served by `serve.ts` (1280×800 ×3, 390×844 ×1), each visually inspected: cover = overview with KPI cards and chart; economy = GDP bars + sector donut; population = population line + age pyramid; phone = prices page with inflation calculator. One fix during inspection: pyramid age-band labels moved out of the bars for contrast, screenshot retaken.
- Kit check: see the kit-check section appended after the first commit (transcripts are supplied by the main chat at bundle time; `transcripts_present` is the only permitted FAIL in this build session).

## Rejected approaches

- Real-country figures: rejected — an original fictional country keeps every number internally consistent and avoids presenting invented figures as a real nation's official statistics.
- Chart library: rejected — hand-drawn SVG keeps the site dependency-free and the dossier source entirely original.

## Kit check (build session, no transcripts)

`node cli/makefun.mjs check --kit <kit> --repo <this repo> --json` → pass 4 (`competition_open`, `snapshot`, `license_osi`, `entrypoint`), **fail 1: `transcripts_present`** (the only permitted FAIL here — transcripts are bundled by the main chat), skip 15 (all transcript-gate checks with no session to read), submission-phase 5 (`repo_public`, `repo_owner`, `repo_created_after_open`, `commit_in_repo`, `duplicate_snapshot` — resolved when the main chat creates the public GitHub repo after the opening and pushes this commit).
