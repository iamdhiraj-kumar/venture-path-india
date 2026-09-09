import { useState } from "react";
import { Boxes, Braces, Brain, Database, Layers, Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { bi, useLang } from "@/lib/i18n";

const STAGES = [
  {
    id: "react",
    icon: Layers,
    en: "React Frontend",
    hi: "रिएक्ट फ्रंटएंड",
    stack: "React 19 · TanStack Start · Tailwind",
    bodyEn: "Multilingual, low-literacy-friendly questionnaire. Captures 12 profile signals in under a minute and works on a ₹6,000 Android phone.",
    bodyHi: "बहुभाषी, कम-साक्षरता के अनुकूल प्रश्नावली। एक मिनट से कम में 12 प्रोफ़ाइल संकेत लेती है और ₹6,000 के एंड्रॉइड फोन पर चलती है।",
  },
  {
    id: "fastapi",
    icon: Server,
    en: "FastAPI Backend",
    hi: "फास्टएपीआई बैकएंड",
    stack: "FastAPI · Pydantic · Redis cache",
    bodyEn: "Validates the profile, normalises turnover and category codes, and orchestrates the matcher. Every response is cached per profile-hash so repeat queries return in milliseconds.",
    bodyHi: "प्रोफ़ाइल की जाँच करता है, कारोबार व श्रेणी कोड सामान्यीकृत करता है और मैचर संचालित करता है। हर उत्तर प्रोफ़ाइल-हैश पर कैश होता है।",
  },
  {
    id: "matcher",
    icon: Braces,
    en: "Rule + NLP Matcher",
    hi: "नियम + एनएलपी मैचर",
    stack: "Deterministic rule engine · sentence-transformers · pgvector",
    bodyEn: "The hybrid core. Hard clauses (age, category, greenfield status, ceilings) are pure Python rules — auditable and never hallucinated. Vector search over scheme text surfaces near-miss and state-level schemes the rules alone would not reach.",
    bodyHi: "हाइब्रिड कोर। कठोर शर्तें (आयु, श्रेणी, ग्रीनफ़ील्ड स्थिति, सीमाएँ) शुद्ध पायथन नियम हैं — जाँचयोग्य और भ्रम-मुक्त। वेक्टर खोज योजना पाठ पर चलकर उन योजनाओं को सामने लाती है जो केवल नियमों से नहीं मिलतीं।",
  },
  {
    id: "postgres",
    icon: Database,
    en: "PostgreSQL + pgvector",
    hi: "पोस्टग्रेएसक्यूएल + pgvector",
    stack: "Schemes · clauses · embeddings · audit log",
    bodyEn: "Schemes stored as versioned rows with an effective-from date, the source URL of the guideline, and the embedding of every clause. Every match is written to an audit log so a decision can be replayed months later.",
    bodyHi: "योजनाएँ संस्करण-सहित पंक्तियों में, प्रभावी तिथि, दिशानिर्देश का स्रोत लिंक और हर खंड का एम्बेडिंग। हर मिलान ऑडिट लॉग में दर्ज होता है ताकि निर्णय बाद में दोहराया जा सके।",
  },
  {
    id: "llm",
    icon: Brain,
    en: "LLM Explainer",
    hi: "एलएलएम व्याख्याकार",
    stack: "Instruction-tuned LLM · RAG over clause store",
    bodyEn: "The model never decides eligibility. It receives the rule engine's verdict plus the cited clauses and rewrites them as plain Hindi/English — the Sahayak assistant. Grounding in retrieved clauses keeps advice traceable.",
    bodyHi: "मॉडल पात्रता तय नहीं करता। उसे नियम इंजन का निर्णय और उद्धृत खंड मिलते हैं, जिन्हें वह सरल हिंदी/अंग्रेज़ी में लिखता है — यही सहायक है। खंडों पर आधारित होने से सलाह प्रमाणित रहती है।",
  },
  {
    id: "sync",
    icon: Boxes,
    en: "Source Sync Worker",
    hi: "स्रोत सिंक वर्कर",
    stack: "Celery beat · scrapers · diff alerts",
    bodyEn: "Nightly crawl of myScheme, KVIC, MoHUA and state portals. A changed ceiling or subsidy rate raises a diff for human review before it goes live — dynamic eligibility handled without silent drift.",
    bodyHi: "myScheme, केवीआईसी, आवासन मंत्रालय और राज्य पोर्टलों की रात्रिकालीन क्रॉलिंग। सीमा या दर बदलने पर मानव समीक्षा हेतु अंतर-सूचना उठती है।",
  },
];

export function ArchitectureDiagram() {
  const { lang } = useLang();
  const [active, setActive] = useState(STAGES[2].id);
  const stage = STAGES.find((s) => s.id === active) ?? STAGES[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div className="rounded-xl border bg-card p-4">
        <ol className="space-y-2">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const on = s.id === active;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setActive(s.id)}
                  aria-pressed={on}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    on ? "border-ashoka bg-accent" : "border-border hover:bg-surface"
                  }`}
                >
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                      on ? "bg-ashoka text-ashoka-foreground" : "bg-surface text-ashoka"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{bi(lang, s.en, s.hi)}</span>
                    <span className="block truncate text-xs text-muted-foreground">{s.stack}</span>
                  </span>
                  <span className="ml-auto text-xs font-mono text-muted-foreground">0{i + 1}</span>
                </button>
                {i < STAGES.length - 1 && (
                  <div className="ml-8 h-3 w-px bg-border" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <Badge variant="outline" className="mb-3">
          {bi(lang, "Pipeline stage", "पाइपलाइन चरण")}
        </Badge>
        <h3 className="text-xl font-bold tracking-tight">{bi(lang, stage.en, stage.hi)}</h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{stage.stack}</p>
        <p className="mt-4 leading-relaxed text-foreground/85">{bi(lang, stage.bodyEn, stage.bodyHi)}</p>
        <div className="mt-6 rounded-lg bg-emerald-soft p-4 text-sm text-emerald">
          <p className="font-semibold">{bi(lang, "Why hybrid, not pure LLM?", "शुद्ध एलएलएम क्यों नहीं, हाइब्रिड क्यों?")}</p>
          <p className="mt-1 opacity-90">
            {bi(
              lang,
              "A wrong eligibility answer costs a marginalized entrepreneur months. Rules give a defensible yes/no; the model only translates it into human language.",
              "गलत पात्रता उत्तर वंचित उद्यमी के महीने बर्बाद करता है। नियम स्पष्ट हाँ/नहीं देते हैं; मॉडल केवल उसे मानवीय भाषा में बदलता है।",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
