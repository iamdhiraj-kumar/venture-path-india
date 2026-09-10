# Sahayak — AI-Driven Scheme Matching for Marginalized Entrepreneurs

**Smart India Hackathon 2026 · Problem Statement SIH26092 · Category: Smart Automation**

Sahayak helps a first-time entrepreneur find the right Government of India funding scheme
in under a minute — with a match score, a plain-language "why you qualify" breakdown,
a subsidy estimate, a document checklist and a step-by-step application roadmap,
in English and हिंदी.

Live prototype: two pages —

| Page | What it shows |
| --- | --- |
| `/` | Live interactive demo — persona switcher, eligibility questionnaire, ranked scheme matches, Sahayak AI advisor |
| `/showcase` | Pitch hub — problem statement, interactive architecture diagram, feasibility & risk matrix, impact calculators, team credits |

---

## 1. Features

### Live scheme-matching demo
- **Judge-friendly persona switcher** — Sunita (rural handloom artisan, SC woman), Ramesh (street food vendor, OBC), Priya (woman tech/services founder), Arjun (differently-abled agri-entrepreneur). One click re-runs matching.
- **Custom eligibility questionnaire** — social category, gender, PwD status, business stage, state, urban/rural, sector, annual turnover, funding needed, loan vs grant preference, age.
- **Ranked results** — match percentage ring, eligible / conditional / not-eligible badge, criteria breakdown, subsidy & benefit highlight, document checklist, application roadmap timeline.
- **Sahayak AI advisor** — slide-over chat that explains a scheme in simple words and demystifies banking jargon (collateral, margin money, CGTMSE cover, moratorium, CIBIL, DPR, Udyam).
- **Language toggle** — English / हिंदी across headings, form labels, personas and scheme summaries.

### Pitch & architecture showcase
- Problem statement card (SIH26092, ministry, background, expected outcome).
- **Interactive pipeline diagram** — React frontend → FastAPI backend → Rule + NLP matcher → PostgreSQL + pgvector → LLM explainer → official-source sync worker. Click any stage for its role, tech and rationale.
- **Feasibility, viability & mitigation matrix** — changing eligibility rules, missing official APIs, LLM hallucination, low digital literacy, state-scheme scaling, privacy.
- **Impact dashboard** — sliders for entrepreneurs reached, hours saved and approval uplift, computing hours saved, credit unlocked and wage value.
- **Team credits.**

---

## 2. Scheme data (the "backend data")

All scheme knowledge lives in **`src/data/schemes.ts`** as typed records — this is the
prototype's database. Nine real central schemes are encoded:

PMEGP · PM SVANidhi · PM Vishwakarma · Stand-Up India · Mudra (Shishu/Kishor/Tarun) ·
CGTMSE · National SC-ST Hub · NHFDC · Agriculture Infrastructure Fund

Each scheme record carries:

```ts
{
  id, name (en/hi), ministry, tagline, benefit,
  criteria: [{ en, hi, hard, weight, test(profile) }],  // eligibility clauses
  subsidy(profile) -> { amount, en, hi },               // subsidy / support estimate
  documents: [...],                                     // document checklist
  roadmap: [...],                                       // step-by-step application path
  explain: { en, hi },                                  // plain-language summary
}
```

**Adding a scheme** = append one object to the `SCHEMES` array. Nothing else changes —
the engine, UI, chat and totals pick it up automatically.

### Matching engine — `src/lib/match-engine.ts`
Deterministic, auditable, and explicitly **not** LLM-decided:

1. Every criterion runs `test(profile)` → `yes` / `partial` / `no`.
2. Criteria marked `hard: true` are **eligibility gates** — any `no` makes the scheme ineligible.
3. Remaining criteria produce a weighted score (`partial` counts half).
4. Results sort by eligibility, then score.

The LLM layer (in the full system) only *explains* this output — it never decides
eligibility. That is the core defensibility argument for the judges.

---

## 3. Tech stack

- **React 19** + **TypeScript**
- **TanStack Start / TanStack Router** (file-based routing, SSR)
- **Vite 7** build
- **Tailwind CSS v4** with semantic design tokens in `src/styles.css`
- **shadcn/ui + Radix UI** primitives, **lucide-react** icons
- No backend, no database, no API keys — fully static and demo-safe.

---

## 4. Run it locally

Requires Node.js 20+ (install via [nvm](https://github.com/nvm-sh/nvm)).

```sh
git clone <your-repo-url>
cd <repo-name>
npm install
npm run dev
```

Open http://localhost:8080

Other commands:

```sh
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # lint
```

---

## 5. Put it on GitHub — step by step

### Option A · Automatic sync from Lovable (easiest)
1. In the Lovable editor, open the **+** menu (bottom-left of the chat) → **GitHub** → **Connect project**.
2. Authorize the Lovable GitHub App and pick your GitHub account or organization.
3. Click **Create Repository**. Your code is pushed immediately, and every future change syncs both ways.

### Option B · Manual push
1. Download the code: Lovable editor → **Code editor** → **Download codebase** (or download the ZIP from the synced repo).
2. On GitHub click **New repository**, name it e.g. `sahayak-sih26092`, keep it public, do **not** add a README (this file is one).
3. In a terminal, from the unzipped project folder:

```sh
git init
git add .
git commit -m "Sahayak — SIH 2026 scheme matching prototype"
git branch -M main
git remote add origin https://github.com/<your-username>/sahayak-sih26092.git
git push -u origin main
```

4. Refresh the GitHub page — the code and this README appear.

### Deploy a public link for the judges
- **From Lovable:** click **Publish** (top right). You get a live `*.lovable.app` URL instantly.
- **From GitHub:** import the repo on Vercel or Netlify, build command `npm run build`. No environment variables are needed.

---

## 6. Project structure

```
src/
  data/schemes.ts               # scheme database, personas, profile types
  lib/
    match-engine.ts             # deterministic eligibility + scoring
    i18n.tsx                    # English/Hindi context, ₹ formatting
  components/
    SiteHeader.tsx              # nav + language toggle
    PersonaSelector.tsx         # judge persona cards
    ProfileForm.tsx             # eligibility questionnaire
    MatchResults.tsx            # match cards, criteria, documents, roadmap
    SahayakChat.tsx             # AI advisor chat (scripted responder)
    showcase/
      ArchitectureDiagram.tsx   # interactive pipeline
      RiskMatrix.tsx            # feasibility & mitigation
      ImpactCalculator.tsx      # impact sliders
      TeamCredits.tsx           # team
  routes/
    __root.tsx                  # app shell + providers
    index.tsx                   # live demo page
    showcase.tsx                # pitch hub
  styles.css                    # design tokens (saffron / emerald / navy)
```

---

## 7. Suggested demo script (3 minutes)

1. Open `/` — read the one-line problem: *the schemes exist, the discovery doesn't.*
2. Click **Sunita** — results re-rank live. Open the top card: match score, why she qualifies, subsidy estimate, documents, roadmap.
3. Click **Arjun** — a different set of schemes surfaces, proving the rule engine, not a hardcoded list.
4. Hit **Explain simply** → Sahayak AI explains the scheme; then ask "what is margin money?".
5. Toggle **हिंदी** — the whole interface switches.
6. Go to **Pitch & Architecture** — walk the pipeline diagram, then the risk matrix, then move the impact sliders to show scale.

---

## 8. Team

- Divyanshu Panwar
- Himanshu Sati
- Saloni Vaish
- Sonakshi Srivastava
- Atishay Mishra
- Dhiraj Kumar

---

## 9. Note on data accuracy

Scheme details are indicative and compiled from publicly available Government of India
guidelines for the purposes of this hackathon prototype. In production, the source-sync
worker shown in the architecture diagram would keep scheme rules current from official
portals and publish a versioned, audited rule set.
