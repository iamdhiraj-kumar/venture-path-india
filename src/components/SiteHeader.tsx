import { Link } from "@tanstack/react-router";
import { Landmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export function SiteHeader() {
  const { lang, setLang, t } = useLang();

  return (
    <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
      <div className="tricolor-rule h-1 w-full" aria-hidden />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Landmark className="size-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight">{t("brand")}</span>
            <span className="hidden text-xs text-muted-foreground sm:block">{t("brandSub")}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto flex items-center gap-1">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold bg-accent text-accent-foreground" }}
            activeOptions={{ exact: true }}
          >
            {t("navDemo")}
          </Link>
          <Link
            to="/showcase"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold bg-accent text-accent-foreground" }}
          >
            {t("navShowcase")}
          </Link>
        </nav>

        <div
          role="group"
          aria-label="Language"
          className="flex overflow-hidden rounded-full border border-border"
        >
          {(["en", "hi"] as const).map((l) => (
            <Button
              key={l}
              variant="ghost"
              size="sm"
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
              className={`h-8 rounded-none px-3 text-xs ${
                lang === l ? "bg-saffron text-saffron-foreground hover:bg-saffron" : ""
              }`}
            >
              {l === "en" ? "English" : "हिंदी"}
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}
