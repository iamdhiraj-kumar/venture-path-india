import { RotateCcw, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { STATES, type Profile } from "@/data/schemes";
import { bi, useLang } from "@/lib/i18n";

type Opt = { value: string; en: string; hi: string };

const CATEGORIES: Opt[] = [
  { value: "SC", en: "SC", hi: "अनुसूचित जाति" },
  { value: "ST", en: "ST", hi: "अनुसूचित जनजाति" },
  { value: "OBC", en: "OBC", hi: "अन्य पिछड़ा वर्ग" },
  { value: "Minority", en: "Minority", hi: "अल्पसंख्यक" },
  { value: "General", en: "General", hi: "सामान्य" },
];
const GENDERS: Opt[] = [
  { value: "female", en: "Woman", hi: "महिला" },
  { value: "male", en: "Man", hi: "पुरुष" },
  { value: "other", en: "Other", hi: "अन्य" },
];
const STAGES: Opt[] = [
  { value: "idea", en: "Idea", hi: "विचार" },
  { value: "new", en: "Starting up", hi: "शुरुआत" },
  { value: "existing", en: "Running", hi: "चालू" },
  { value: "expansion", en: "Expanding", hi: "विस्तार" },
];
const SECTORS: Opt[] = [
  { value: "manufacturing", en: "Manufacturing", hi: "विनिर्माण" },
  { value: "service", en: "Services / tech", hi: "सेवा / तकनीक" },
  { value: "trading", en: "Trading / retail", hi: "व्यापार / खुदरा" },
  { value: "agri", en: "Agri & allied", hi: "कृषि एवं सहबद्ध" },
  { value: "artisan", en: "Artisan / handicraft", hi: "कारीगर / हस्तशिल्प" },
  { value: "street-vendor", en: "Street vending", hi: "रेहड़ी-पटरी" },
];
const AREAS: Opt[] = [
  { value: "rural", en: "Rural", hi: "ग्रामीण" },
  { value: "urban", en: "Urban", hi: "शहरी" },
];
const PREFS: Opt[] = [
  { value: "loan", en: "Loan", hi: "ऋण" },
  { value: "grant", en: "Grant / subsidy", hi: "अनुदान / सब्सिडी" },
  { value: "any", en: "No preference", hi: "कोई प्राथमिकता नहीं" },
];

function Choice({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Opt[];
  value: string;
  onChange: (v: string) => void;
}) {
  const { lang } = useLang();
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              value === o.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary/40 hover:bg-accent"
            }`}
          >
            {bi(lang, o.en, o.hi)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ProfileForm({
  profile,
  onChange,
  onSubmit,
  onReset,
}: {
  profile: Profile;
  onChange: (p: Profile) => void;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const { t, lang } = useLang();
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => onChange({ ...profile, [k]: v });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("fName")}</Label>
          <Input id="name" value={profile.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">{t("fState")}</Label>
          <select
            id="state"
            value={profile.state}
            onChange={(e) => set("state", e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Choice label={t("fCategory")} options={CATEGORIES} value={profile.category} onChange={(v) => set("category", v as Profile["category"])} />
        <Choice label={t("fGender")} options={GENDERS} value={profile.gender} onChange={(v) => set("gender", v as Profile["gender"])} />
        <Choice label={t("fStage")} options={STAGES} value={profile.stage} onChange={(v) => set("stage", v as Profile["stage"])} />
        <Choice label={t("fArea")} options={AREAS} value={profile.area} onChange={(v) => set("area", v as Profile["area"])} />
      </div>

      <Choice label={t("fSector")} options={SECTORS} value={profile.sector} onChange={(v) => set("sector", v as Profile["sector"])} />
      <Choice label={t("fPreference")} options={PREFS} value={profile.preference} onChange={(v) => set("preference", v as Profile["preference"])} />

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="turnover">{t("fTurnover")}</Label>
          <Input
            id="turnover"
            type="number"
            min={0}
            step={10000}
            value={profile.turnover}
            onChange={(e) => set("turnover", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="funding">{t("fFunding")}</Label>
          <Input
            id="funding"
            type="number"
            min={0}
            step={10000}
            value={profile.funding}
            onChange={(e) => set("funding", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">{t("fAge")}</Label>
          <Input
            id="age"
            type="number"
            min={16}
            max={80}
            value={profile.age}
            onChange={(e) => set("age", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-surface px-4 py-3">
        <Label htmlFor="pwd" className="cursor-pointer text-sm font-medium">
          {t("fPwd")}
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
            {bi(lang, "Unlocks NHFDC and higher CGTMSE cover", "एनएचएफडीसी और अधिक सीजीटीएमएसई कवर सक्रिय करता है")}
          </span>
        </Label>
        <Switch id="pwd" checked={profile.pwd} onCheckedChange={(v) => set("pwd", v)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="gap-2 bg-saffron text-saffron-foreground hover:bg-saffron/90">
          <Wand2 aria-hidden />
          {t("runMatch")}
        </Button>
        <Button type="button" variant="outline" className="gap-2" onClick={onReset}>
          <RotateCcw aria-hidden />
          {t("reset")}
        </Button>
      </div>
    </form>
  );
}
