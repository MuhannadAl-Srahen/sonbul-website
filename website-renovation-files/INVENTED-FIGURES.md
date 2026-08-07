# Invented figures on the website

Every number and factual claim below was **written as plausible filler during the
2026 restructure**. None of it came from you, the old website, the presentation
deck or the company record. It is live on the site and reads to a visitor as fact.

Your brief said to fill gaps with fillers that make sense, so this is expected,
but a client or a competitor can check most of it. Replace each figure with the
real one, or delete the stat.

Last updated: 2026-08-06

---

## 1. Stat bands (the large animated numbers)

These are the most exposed: they sit in the red band directly under each hero.

| Where | Figure | File |
|---|---|---|
| `/transport` | **60+** trucks and trailers | `src/i18n/locales/{en,ar}/transport.json` → `transport.stats.trucks` |
| `/transport` | **300+** loads a month | `transport.stats.loads` |
| `/project-services` | **4** camps built and run | `src/i18n/locales/{en,ar}/project-services.json` → `projectServices.stats.camps` |
| `/project-services` | **1,800+** meals served daily | `projectServices.stats.meals` |
| `/project-services` | **3+** years on major programmes | `projectServices.stats.years` |
| `/logistics` | **12+** forklifts on station | `src/i18n/locales/{en,ar}/logistics.json` → `logisticsCo.stats.forklifts` |
| `/logistics` | **25t** lifting capacity | `logisticsCo.stats.capacity` |
| `/logistics` | **24/7** crews on call | `logisticsCo.stats.hours` |

## 2. A reused figure that changed meaning

| Claim | Problem |
|---|---|
| `/transport`: "**40+** regular shippers" | The original site said "40+ trusted clients" for the business as a whole. It is now presented as one company's client count. |

## 3. Prose claims worth checking

Softer than the stat bands, but still stated as fact.

- **`/logistics`**: "the same crew standards and the same single point of contact at every one" of the four crossings, and equipment "kept at the crossing" permanently. Presence at all four crossings came from your brief; *permanent stationing of equipment at each* did not.
- **`/transport/fleet`**: the trailer types listed (flatbeds, curtain-siders, tippers, lowbeds, **tankers**) and "our own workshop and mechanics". Tankers and the in-house workshop were invented.
- **`/transport/routes`**: the four named corridors (Riyadh / Jeddah / Dammam–Jubail / Aqaba and domestic) and the claim that return legs run loaded.
- **`/transport/cargo`**: chemical trailer cleaning and certification between products.
- **`/project-services/camps`**: the six-stage camp process, and generator redundancy, potable/grey water separation and on-site medical rooms.
- **`/project-services/catering`**: refrigerated on-site storage, documented cleaning schedules and temperature logs, and meal service matched to night shifts.
- **`/logistics/customs`**: a named contact per shipment who calls when something changes.
- **`/logistics/equipment`**: winches and recovery gear, slings/spreaders/clamps/drum handlers, certified operators, and scheduled in-house servicing.

## 4. Maintenance hazard

`/services` says "**Sixteen services in total**" in both languages. That is correct
today (4 + 8 + 4). It becomes false the moment anyone adds or removes a service,
and nothing checks it.

- `src/i18n/locales/en/common.json` → `services.hero.subtitle`
- `src/i18n/locales/ar/common.json` → `services.hero.subtitle`

---

## What is NOT invented

For contrast, these were all in the original site, your brief or the company
record, and can stay as they are:

- Founded in Jordan, 2008, by Raed Abdel Fatah Abu Sonbul
- 30+ years of leadership experience
- 80+ people across six specialised departments
- The group stat band: 18+ years, 25+ major projects, 40+ clients, 80+ team
- ADNOC Azraq and Sarhan, 2+ years
- ARGAS Al-Jaffr, about 1 year, workforce peaking at 600
- The four crossings: Jaber, Tarbil, Al-Karamah, Al-Omari
- Head office in Sahab, Al-Faisaliah, Amman; both phone numbers; the email
- Company record: general partnership, national establishment no. 200192602,
  registration no. 123740, registered 13/04/2023, capital 50,000 JOD

## Also unverified: photo attribution

No photo is tagged as ARGAS or ADNOC, because the images carry no signage that
distinguishes the two programmes and guessing would put a false claim on a case
study. Both case-study pages therefore show the same general company photos. If
you can identify which photos belong to which project, it is one line per photo
in `src/data/media.ts`.
