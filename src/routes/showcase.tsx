import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CircuitBoard, ShieldCheck, Target, TrendingUp, UsersRound } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { ArchitectureDiagram } from "@/components/showcase/ArchitectureDiagram";
import { ImpactCalculator } from "@/components/showcase/ImpactCalculator";
import { RiskMatrix } from "@/components/showcase/RiskMatrix";
import { TeamCredits } from "@/components/showcase/TeamCredits";
import { Badge } from "@/components/ui/badge";
import { bi, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/showcase")({
  head: () => ({
    meta: [
      { title: "Pitch & Technical Architecture — Sahayak | SIH26092" },
      {
        name: "description",
        content:
          "Problem statement, hybrid rule-engine + LLM architecture, feasibility and risk mitigation matrix, impact calculators and team credits for SIH26092.",
      },
      { property: "og:title", content: "Pitch & Technical Architecture — Sahayak | SIH26092" },
      {
        property: "og:description",
        content:
          "How the hybrid AI/NLP and deterministic rule pipeline works, why it is feasible, and the social and economic impact it unlocks.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShowcasePage,
});

const TABS = [
  { id: "problem", icon: Target, en: "Problem", hi: "समस्या" },
  { id: "architecture", icon: CircuitBoard, en: "Architecture", hi: "आर्किटेक्चर" },
  { id: "feasibility", icon: ShieldCheck, en: "Feasibility & Risk", hi: "व्यवहार्यता एवं जोखिम" },
  { id: "impact", icon: TrendingUp, en: "Impact", hi: "प्रभाव" },
  { id: "team", icon: UsersRound, en: "Team", hi: "टीम" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function ProblemPanel() {
  const { lang } = useLang();
  const facts = [
    {
      k: bi(lang, "Problem Statement ID", "समस्या विवरण आईडी"),
      v: "SIH26092",
    },
    { k: bi(lang, "Category", "श्रेणी"), v: bi(lang, "Software · Smart Automation", "सॉफ़्टवेयर · स्मार्ट ऑटोमेशन") },
    { k: bi(lang, "Theme", "विषय"), v: bi(lang, "Inclusive entrepreneurship & financial access", "समावेशी उद्यमिता एवं वित्तीय पहुँच") },
    { k: bi(lang, "Target users", "लक्षित उपयोगकर्ता"), v: bi(lang, "SC/ST, OBC, women, minority and differently-abled entrepreneurs", "एससी/एसटी, ओबीसी, महिला, अल्पसंख्यक एवं दिव्यांग उद्यमी") },
  ];

  const pains = [
    {
      en: "Hundreds of central and state schemes sit across dozens of portals, each with its own eligibility language.",
      hi: "सैकड़ों केंद्रीय एवं राज्य योजनाएँ दर्जनों पोर्टलों पर बिखरी हैं, हर एक की अपनी पात्रता भाषा।",
    },
    {
      en: "Guidelines are written in legal-financial English that a first-generation entrepreneur cannot parse.",
      hi: "दिशानिर्देश विधिक-वित्तीय अंग्रेज़ी में हैं, जिन्हें पहली पीढ़ी का उद्यमी नहीं समझ पाता।",
    },
    {
      en: "Wrong-scheme applications get rejected after weeks, and the applicant often never tries again.",
      hi: "गलत योजना में आवेदन हफ़्तों बाद अस्वीकृत होता है, और आवेदक अक्सर दोबारा प्रयास नहीं करता।",
    },
    {
      en: "Middlemen charge thousands of rupees for information that should be free and instant.",
      hi: "बिचौलिये उस जानकारी के हज़ारों रुपये लेते हैं जो निःशुल्क और तत्काल होनी चाहिए।",
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-bold tracking-tight">
          {bi(lang, "AI-Driven Scheme Matching for Marginalized Entrepreneurs", "वंचित उद्यमियों हेतु एआई-आधारित योजना मिलान")}
        </h3>
        <dl className="mt-4 divide-y">
          {facts.map((f) => (
            <div key={f.k} className="flex flex-wrap gap-2 py-2.5 text-sm">
              <dt className="w-44 shrink-0 text-muted-foreground">{f.k}</dt>
              <dd className="font-medium">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-bold tracking-tight">{bi(lang, "Why it hurts today", "आज यह क्यों चुभता है")}</h3>
        <ul className="mt-4 space-y-3 text-sm">
          {pains.map((p) => (
            <li key={p.en} className="flex gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-saffron" aria-hidden />
              <span className="text-foreground/85">{bi(lang, p.en, p.hi)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-lg bg-accent p-4 text-sm text-accent-foreground">
          <strong className="block">{bi(lang, "Our answer", "हमारा उत्तर")}</strong>
          {bi(
            lang,
            "One profile, once. A deterministic engine decides eligibility; an LLM explains it in the applicant's own language; a roadmap tells them exactly what to do on Monday morning.",
            "एक ही बार प्रोफ़ाइल। नियम-आधारित इंजन पात्रता तय करता है; एलएलएम उसे आवेदक की भाषा में समझाता है; रोडमैप बताता है कि सोमवार सुबह क्या करना है।",
          )}
        </div>
      </div>
    </div>
  );
}

function ShowcasePage() {
  const { lang } = useLang();
  const [tab, setTab] = useState<TabId>("problem");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Badge variant="outline" className="border-ashoka text-ashoka">
          {bi(lang, "Pitch & Technical Showcase Hub", "पिच एवं तकनीकी शोकेस हब")}
        </Badge>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          {bi(lang, "How Sahayak works, and why it will hold up.", "सहायक कैसे काम करता है, और यह क्यों टिकेगा।")}
        </h1>

        <div role="tablist" aria-label="Showcase sections" className="mt-7 flex flex-wrap gap-2 border-b pb-3">
          {TABS.map((tb) => {
            const Icon = tb.icon;
            const on = tab === tb.id;
            return (
              <button
                key={tb.id}
                role="tab"
                aria-selected={on}
                onClick={() => setTab(tb.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  on
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="size-4" aria-hidden />
                {bi(lang, tb.en, tb.hi)}
              </button>
            );
          })}
        </div>

        <div className="py-8">
          {tab === "problem" && <ProblemPanel />}
          {tab === "architecture" && <ArchitectureDiagram />}
          {tab === "feasibility" && <RiskMatrix />}
          {tab === "impact" && <ImpactCalculator />}
          {tab === "team" && (
            <div className="space-y-4">
              <p className="max-w-2xl text-sm text-muted-foreground">
                {bi(
                  lang,
                  "Built by a six-member team for Smart India Hackathon 2026.",
                  "स्मार्ट इंडिया हैकाथॉन 2026 हेतु छह सदस्यीय टीम द्वारा निर्मित।",
                )}
              </p>
              <TeamCredits />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
