import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Sparkles, Users } from "lucide-react";

import { MatchCard } from "@/components/MatchResults";
import { PersonaSelector } from "@/components/PersonaSelector";
import { ProfileForm } from "@/components/ProfileForm";
import { SiteHeader } from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PERSONAS, type Persona, type Profile } from "@/data/schemes";
import { bi, formatINR, useLang } from "@/lib/i18n";
import { matchSchemes, totalSupport } from "@/lib/match-engine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sahayak — AI Scheme Matching for Marginalized Entrepreneurs | SIH26092" },
      {
        name: "description",
        content:
          "Live demo: match Indian entrepreneurs to PMEGP, PM SVANidhi, Mudra, Stand-Up India and more, with match scores, subsidy estimates and application roadmaps.",
      },
      { property: "og:title", content: "Sahayak — AI Scheme Matching for Marginalized Entrepreneurs" },
      {
        property: "og:description",
        content:
          "A hybrid rule-engine and AI prototype that finds the right government scheme in 60 seconds, in English and Hindi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoPage,
});

const DEFAULT_PROFILE = PERSONAS[0].profile;

function DemoPage() {
  const { t, lang } = useLang();
  const [personaId, setPersonaId] = useState<string | null>(PERSONAS[0].id);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [submitted, setSubmitted] = useState<Profile>(DEFAULT_PROFILE);
  const [showAll, setShowAll] = useState(false);

  const results = useMemo(() => matchSchemes(submitted), [submitted]);
  const eligible = results.filter((r) => r.eligible);
  const visible = showAll ? results : eligible;
  const support = totalSupport(results);

  const pickPersona = (p: Persona) => {
    setPersonaId(p.id);
    setProfile(p.profile);
    setSubmitted(p.profile);
  };

  const stats = [
    { value: "9", label: t("statSchemes") },
    { value: "44", label: t("statRules") },
    { value: "2 → 12", label: t("statLangs") },
    { value: "< 1 min", label: t("statTime") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="hero-wash border-b">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
            <Badge variant="outline" className="border-saffron bg-card text-saffron">
              {t("heroTag")}
            </Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("heroBody")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 bg-saffron text-saffron-foreground hover:bg-saffron/90">
                <a href="#demo">
                  <Sparkles aria-hidden />
                  {t("ctaTryPersona")}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/showcase">
                  {t("ctaShowcase")}
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>

            <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border bg-card/80 px-4 py-3">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</dt>
                  <dd className="text-2xl font-bold tracking-tight">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="demo" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6">
          <header className="mb-5 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-saffron-soft text-saffron">
              <Users className="size-4" aria-hidden />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{t("step1")}</h2>
              <p className="text-sm text-muted-foreground">{t("step1Sub")}</p>
            </div>
          </header>
          <PersonaSelector activeId={personaId} onSelect={pickPersona} />
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div className="rounded-xl border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
            <header className="mb-5 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-emerald-soft text-emerald">
                <ClipboardList className="size-4" aria-hidden />
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight">{t("step2")}</h2>
                <p className="text-xs text-muted-foreground">{t("step2Sub")}</p>
              </div>
            </header>
            <ProfileForm
              profile={profile}
              onChange={(p) => {
                setProfile(p);
                setPersonaId(null);
              }}
              onSubmit={() => setSubmitted(profile)}
              onReset={() => pickPersona(PERSONAS[0])}
            />
          </div>

          <div>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight">{t("step3")}</h2>
                <p className="text-sm text-muted-foreground">
                  {bi(lang, "Ranked for ", "इनके लिए क्रमबद्ध: ")}
                  <strong className="text-foreground">{submitted.name || bi(lang, "your profile", "आपकी प्रोफ़ाइल")}</strong>
                  {" · "}
                  {eligible.length} {bi(lang, "eligible schemes", "पात्र योजनाएँ")}
                </p>
              </div>
              <div className="rounded-lg border bg-card px-4 py-2 text-right">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {t("estSupport")}
                </p>
                <p className="text-xl font-bold text-emerald">{formatINR(support)}</p>
              </div>
            </div>

            <div className="space-y-4">
              {visible.map((r, i) => (
                <MatchCard key={r.scheme.id} result={r} rank={i} />
              ))}
            </div>

            <Button
              variant="ghost"
              className="mt-4 text-muted-foreground"
              onClick={() => setShowAll((v) => !v)}
              aria-pressed={showAll}
            >
              {showAll ? bi(lang, "Hide non-matching schemes", "अपात्र योजनाएँ छिपाएँ") : t("showAll")}
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground sm:px-6">
          {bi(
            lang,
            "Prototype built for Smart India Hackathon 2026 · Problem Statement SIH26092. Scheme details are indicative and sourced from public government guidelines.",
            "स्मार्ट इंडिया हैकाथॉन 2026 · समस्या विवरण SIH26092 हेतु निर्मित प्रोटोटाइप। योजना विवरण सांकेतिक हैं और सार्वजनिक सरकारी दिशानिर्देशों पर आधारित हैं।",
          )}
        </div>
      </footer>
    </div>
  );
}
