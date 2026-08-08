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
| `/transport` | **150+** trucks and trailers | `src/i18n/locales/{en,ar}/transport.json` → `transport.stats.trucks` |
| `/transport` | **1,000+** loads a month | `transport.stats.loads` |
| `/project-services` | **6+** camps built and run | `src/i18n/locales/{en,ar}/project-services.json` → `projectServices.stats.camps` |
| `/project-services` | **1,800+** meals served daily | `projectServices.stats.meals` |
| `/project-services` | **3+** years on major programmes | `projectServices.stats.years` |
| `/logistics` | **20+** forklifts on station | `src/i18n/locales/{en,ar}/logistics.json` → `logisticsCo.stats.forklifts` |
| `/logistics` | **25t** lifting capacity | `logisticsCo.stats.capacity` |
| `/logistics` | **24/7** crews on call | `logisticsCo.stats.hours` |

## 2. A reused figure that changed meaning

| Claim | Problem |
|---|---|
| `/transport`: "**60+** regular shippers" | The original site said "40+ trusted clients" for the business as a whole. It is now presented as one company's client count. |

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
- 250+ people across six specialised departments
- The group stat band: 18+ years, 40+ major projects, 60+ clients, 250+ team
- ADNOC at Azraq and Om Lahem, 2+ years (locations confirmed by the client, August 2026)
- ARGAS at Azraq, about 1 year, workforce peaking at 600 (location confirmed by the client)
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

## 6. Figures raised in August 2026, at the client's request

The client said the published numbers were too low, gave **1,000+ loads a month** as the
real figure, and asked for the rest to be scaled to match while leaving the 18 years
alone. These are the values that changed, and why the fleet and headcount had to move
with the load count rather than staying put:

| Figure | Was | Now |
|---|---|---|
| Loads a month | 300+ | **1,000+** (the client's own number) |
| Trucks and trailers | 60+ | **150+** |
| People on the payroll | 80+ | **250+** |
| Regular clients | 40+ | **60+** |
| Major projects | 25+ | **40+** |
| Forklifts on station | 12+ | **20+** |
| Camps built and run | 4 | **6+** |

1,000 loads a month across 60 trucks would be about 16 runs per truck. A Jordan to Saudi
round trip takes five to seven days including the border, so that is not physically
possible and a reader in the industry would notice. At 150 trucks it is roughly six or
seven runs each, which holds up. The headcount moved for the same reason: 250 on the
payroll is consistent with a fleet that size plus camp and crossing crews.

Left alone on purpose: **18+ years** and **2008**, because you asked; **600+ peak
workforce** and **1,800+ meals daily**, because they are the ARGAS figures and the meals
number is 600 x 3, so raising one without the other would break the arithmetic; **4
border crossings**, **25t** and **24/7**, which are facts rather than estimates.

Everything in this section is still an estimate except the load count. If the real fleet
size and headcount are known, they should replace these.

## 7. Project locations, corrected August 2026

The brief never named a location for either project, so the site invented them. The
client has now given the real ones and they are in place:

| Project | Site used to say | Actually |
|---|---|---|
| ARGAS | Al-Jaffr, "southern Jordan" | **Azraq**, in the eastern desert |
| ADNOC | Azraq and Sarhan | **Azraq and Om Lahem** |

Om Lahem is in Ma'an and is the same place the site had been calling Al-Jaffr, so that
name was not wrong, it was attached to the wrong project. **Sarhan was invented
outright and is gone.** The project URLs changed with it, to `/argas-azraq` and
`/adnoc-azraq-om-lahem`, which is safe only because these pages have never been live.

### Still an estimate: one map pin

The map in "Where we work" plots seven places. Six are settled towns, a port, or a
crossing whose position is known. **Al-Omari is placed on the Saudi frontier
south-east of Azraq at roughly the right point along it**, which is accurate enough at
the scale of a whole country but is not survey data. If the client can give a pin,
correct `lon` and `lat` for `omari` in `src/data/places.ts` and nothing else needs
touching, because the map projects real coordinates rather than storing pixels.

The Jordan outline itself is a 22-point simplification, not a survey boundary.
