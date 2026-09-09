import { Badge } from "@/components/ui/badge";
import { PERSONAS, type Persona } from "@/data/schemes";
import { bi, useLang } from "@/lib/i18n";

export function PersonaSelector({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (p: Persona) => void;
}) {
  const { lang } = useLang();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {PERSONAS.map((p) => {
        const active = p.id === activeId;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p)}
            aria-pressed={active}
            className={`group h-full rounded-xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active ? "border-saffron ring-2 ring-saffron/40" : "border-border"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-saffron-soft text-2xl" aria-hidden>
                {p.emoji}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{bi(lang, p.name, p.nameHi)}</p>
                <p className="text-xs text-muted-foreground">{bi(lang, p.headline, p.headlineHi)}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tags.map((tag) => (
                <Badge key={tag.en} variant="secondary" className="font-normal">
                  {bi(lang, tag.en, tag.hi)}
                </Badge>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
