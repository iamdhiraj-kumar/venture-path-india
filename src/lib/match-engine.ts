import { SCHEMES, type Profile, type Scheme } from "@/data/schemes";

export type CriterionResult = {
  en: string;
  hi: string;
  status: "yes" | "partial" | "no";
  hard: boolean;
  weight: number;
};

export type MatchResult = {
  scheme: Scheme;
  score: number;
  eligible: boolean;
  blocked: CriterionResult[];
  criteria: CriterionResult[];
  support: { amount: number; en: string; hi: string };
};

/**
 * Deterministic eligibility engine.
 * Hard clauses gate eligibility; soft clauses drive the weighted confidence score.
 * The LLM layer in the full system only explains this output — it never decides it.
 */
export function matchSchemes(profile: Profile): MatchResult[] {
  return SCHEMES.map((scheme) => {
    const criteria: CriterionResult[] = scheme.criteria.map((c) => ({
      en: c.en,
      hi: c.hi,
      hard: Boolean(c.hard),
      weight: c.weight,
      status: c.test(profile),
    }));

    const total = criteria.reduce((s, c) => s + c.weight, 0);
    const earned = criteria.reduce(
      (s, c) => s + (c.status === "yes" ? c.weight : c.status === "partial" ? c.weight * 0.5 : 0),
      0,
    );

    const blocked = criteria.filter((c) => c.hard && c.status === "no");
    const eligible = blocked.length === 0;
    const raw = total === 0 ? 0 : (earned / total) * 100;
    const score = Math.round(eligible ? Math.max(52, raw) : Math.min(38, raw));

    return {
      scheme,
      score,
      eligible,
      blocked,
      criteria,
      support: scheme.subsidy(profile),
    };
  }).sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.score - a.score);
}

export function totalSupport(results: MatchResult[]) {
  return results
    .filter((r) => r.eligible)
    .slice(0, 3)
    .reduce((s, r) => s + r.support.amount, 0);
}
