# SIH 2026 — AI Scheme Matching Prototype (SIH26092)

A presentation-ready demo site with two halves: a live scheme-matching experience and a pitch/technical showcase hub.

## Pages

- `/` — Landing + live demo (hero, persona selector, questionnaire, results)
- `/showcase` — Problem statement, architecture, feasibility, impact, team
- Shared header with navigation, language toggle (English / हिंदी), and Sahayak AI chat launcher

## 1. Live Scheme Matching Demo

- **Persona quick-select cards**: Sunita (rural handloom artisan, SC woman), Ramesh (street food vendor, OBC), Priya (woman tech/service entrepreneur), Amit (differently-abled agri-business). One click fills the profile and runs matching.
- **Custom profile form**: social category (SC/ST/OBC/General/Minority), gender, differently-abled, business stage, state, sector, annual turnover, funding needed, loan vs grant/subsidy preference, age.
- **Scheme database** (in-app data file, real scheme facts): PMEGP, PM SVANidhi, PM Vishwakarma, Stand-Up India, Mudra Shishu/Kishor/Tarun, CGTMSE, National SC/ST Hub, Mahila Udyam Nidhi, NHFDC, Startup India Seed Fund, ASPIRE.
- **Match results**: ranked cards with match percentage ring, "Why you qualify" criteria breakdown (met / partly met / not met), subsidy and benefit highlight, document checklist, and a step-by-step application roadmap timeline.
- **Sahayak AI assistant**: slide-over chat that explains a selected scheme in plain language and demystifies banking jargon (collateral, margin money, CGTMSE cover, moratorium). Prototype uses a scripted intent-matching responder over the same scheme data — no backend needed for the demo.
- **Language toggle**: English / Hindi strings for headings, labels, persona cards, and key scheme summaries.

## 2. Showcase Hub

- Problem statement card: SIH26092, Smart Automation category, ministry, background, expected outcome.
- **Architecture visualizer**: clickable pipeline (User → React frontend → FastAPI → NLP profile parser → Vector search over scheme corpus → Deterministic rule engine → LLM reasoning/explanation → PostgreSQL scheme + audit store). Selecting a stage reveals its role, tech, and why hybrid beats pure-LLM.
- **Feasibility, viability & mitigation matrix**: risks (dynamic eligibility changes, official source sync, hallucinated advice, low digital literacy, language coverage) with likelihood/impact badges and mitigations.
- **Impact dashboard**: interactive calculators — sliders for entrepreneurs reached, average time saved per applicant, approval-rate uplift — computing hours saved, credit unlocked, and cost of exclusion avoided, plus social/economic/digital impact cards.
- **Team credits**: grid of member cards.

## Design

Indian government portal warmth meets fintech clarity: saffron and emerald accents on a crisp off-white base, deep navy text, Ashoka-blue detail line, rounded cards with soft shadows, badge-heavy layout, responsive tabs. All colors added as semantic tokens in the stylesheet, dark mode included. Accessible: keyboard-navigable tabs, focus rings, ARIA labels, contrast-checked pairs.

## Technical notes

- Frontend only — no backend, no database. Scheme data and the matching engine live in `src/data/schemes.ts` and `src/lib/match-engine.ts` as deterministic scoring (hard eligibility gates + weighted soft criteria) so results are stable for judges.
- Translation strings in `src/lib/i18n.ts` with a React context for the toggle.
- Per-page SEO metadata on both routes.

## Open item

The team member names were not included in the request. I will ship the team section with clearly marked placeholder names and roles — send me the real list and I will drop it in.
