import { useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDashed, FileText, MessageCircleQuestion, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSahayak } from "@/components/SahayakChat";
import { bi, formatINR, useLang } from "@/lib/i18n";
import type { MatchResult } from "@/lib/match-engine";

function ScoreRing({ score, eligible }: { score: number; eligible: boolean }) {
  const color = eligible ? "var(--emerald)" : "var(--warning)";
  return (
    <div
      className="relative grid size-16 shrink-0 place-items-center rounded-full"
      style={{ background: `conic-gradient(${color} ${score * 3.6}deg, var(--muted) 0deg)` }}
      role="img"
      aria-label={`Match score ${score} percent`}
    >
      <div className="grid size-12 place-items-center rounded-full bg-card">
        <span className="text-sm font-bold">{score}%</span>
      </div>
    </div>
  );
}

const statusIcon = {
  yes: <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden />,
  partial: <CircleDashed className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />,
  no: <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />,
} as const;

export function MatchCard({ result, rank }: { result: MatchResult; rank: number }) {
  const { lang, t } = useLang();
  const { open } = useSahayak();
  const [tab, setTab] = useState<"why" | "docs" | "roadmap">("why");
  const { scheme } = result;

  const tabs = [
    { id: "why" as const, label: t("whyQualify") },
    { id: "docs" as const, label: t("documents") },
    { id: "roadmap" as const, label: t("roadmap") },
  ];

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md ${
        result.eligible ? "border-border" : "border-dashed opacity-90"
      }`}
    >
      <div className="flex flex-wrap items-start gap-4 border-b p-5">
        <ScoreRing score={result.score} eligible={result.eligible} />
        <div className="min-w-56 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {rank === 0 && result.eligible && (
              <Badge className="bg-saffron text-saffron-foreground hover:bg-saffron">{t("bestMatch")}</Badge>
            )}
            <Badge variant={result.eligible ? "secondary" : "outline"} className={result.eligible ? "bg-emerald-soft text-emerald" : "text-warning"}>
              {result.eligible ? t("eligible") : t("notEligible")}
            </Badge>
            <Badge variant="outline" className="font-normal capitalize">
              {scheme.type.replace("-", " ")}
            </Badge>
          </div>
          <h3 className="mt-2 text-lg font-bold tracking-tight">{bi(lang, scheme.name, scheme.nameHi)}</h3>
          <p className="text-xs text-muted-foreground">{bi(lang, scheme.ministry, scheme.ministryHi)}</p>
          <p className="mt-2 text-sm text-foreground/80">{bi(lang, scheme.tagline, scheme.taglineHi)}</p>
        </div>
        <div className="rounded-lg bg-emerald-soft px-4 py-3 text-emerald">
          <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">{t("benefit")}</p>
          <p className="text-xl font-bold">{formatINR(result.support.amount)}</p>
          <p className="max-w-52 text-xs opacity-90">{bi(lang, result.support.en, result.support.hi)}</p>
        </div>
      </div>

      {!result.eligible && result.blocked.length > 0 && (
        <div className="flex items-start gap-2 border-b bg-accent px-5 py-3 text-sm text-accent-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            {bi(lang, "Blocked by: ", "बाधा: ")}
            {result.blocked.map((b) => bi(lang, b.en, b.hi)).join(" · ")}
          </span>
        </div>
      )}

      <div className="flex gap-1 border-b px-3 pt-3">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            type="button"
            onClick={() => setTab(tb.id)}
            aria-pressed={tab === tb.id}
            className={`rounded-t-md px-3 py-2 text-xs font-semibold transition-colors ${
              tab === tb.id
                ? "border-b-2 border-saffron text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="p-5 text-sm">
        {tab === "why" && (
          <ul className="space-y-2">
            {result.criteria.map((c) => (
              <li key={c.en} className="flex items-start gap-2">
                {statusIcon[c.status]}
                <span className={c.status === "no" ? "text-muted-foreground" : ""}>
                  {bi(lang, c.en, c.hi)}
                  {c.hard && (
                    <Badge variant="outline" className="ml-2 align-middle text-[10px] font-normal">
                      {bi(lang, "mandatory", "अनिवार्य")}
                    </Badge>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}

        {tab === "docs" && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {scheme.documents.map((d) => (
              <li key={d.en} className="flex items-start gap-2 rounded-md bg-surface px-3 py-2">
                <FileText className="mt-0.5 size-4 shrink-0 text-ashoka" aria-hidden />
                {bi(lang, d.en, d.hi)}
              </li>
            ))}
          </ul>
        )}

        {tab === "roadmap" && (
          <ol className="relative space-y-4 border-l border-dashed pl-6">
            {scheme.roadmap.map((s, i) => (
              <li key={s.en} className="relative">
                <span className="absolute -left-[31px] grid size-5 place-items-center rounded-full bg-ashoka text-[10px] font-bold text-ashoka-foreground">
                  {i + 1}
                </span>
                <p className="font-medium">{bi(lang, s.en, s.hi)}</p>
                <p className="text-xs text-muted-foreground">{bi(lang, s.detailEn, s.detailHi)}</p>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => open(bi(lang, `Explain ${scheme.name}`, `${scheme.nameHi} समझाएँ`))}
          >
            <MessageCircleQuestion aria-hidden />
            {t("explain")}
          </Button>
          <span className="self-center text-xs text-muted-foreground">
            {bi(lang, "Ceiling: ", "अधिकतम सीमा: ")}
            {formatINR(scheme.ceiling)}
          </span>
        </div>
      </div>
    </article>
  );
}
