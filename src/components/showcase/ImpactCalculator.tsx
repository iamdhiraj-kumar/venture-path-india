import { useMemo, useState } from "react";
import { Clock, IndianRupee, Landmark, Users } from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { bi, formatINR, useLang } from "@/lib/i18n";

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <span className="grid size-9 place-items-center rounded-lg bg-saffron-soft text-saffron">
        <Icon className="size-4" aria-hidden />
      </span>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

export function ImpactCalculator() {
  const { lang } = useLang();
  const [users, setUsers] = useState(50000);
  const [hoursSaved, setHoursSaved] = useState(22);
  const [uplift, setUplift] = useState(18);

  const derived = useMemo(() => {
    const totalHours = users * hoursSaved;
    const extraApprovals = Math.round(users * (uplift / 100) * 0.42);
    const creditUnlocked = extraApprovals * 240000;
    const wagesSaved = totalHours * 62;
    return { totalHours, extraApprovals, creditUnlocked, wagesSaved };
  }, [users, hoursSaved, uplift]);

  const controls = [
    {
      id: "users",
      label: bi(lang, "Entrepreneurs reached per year", "प्रति वर्ष पहुँच बनाए उद्यमी"),
      value: users,
      set: setUsers,
      min: 5000,
      max: 1000000,
      step: 5000,
      fmt: (v: number) => v.toLocaleString("en-IN"),
    },
    {
      id: "hours",
      label: bi(lang, "Hours saved per applicant (search, travel, agents)", "प्रति आवेदक बचे घंटे (खोज, यात्रा, एजेंट)"),
      value: hoursSaved,
      set: setHoursSaved,
      min: 4,
      max: 60,
      step: 1,
      fmt: (v: number) => `${v} hrs`,
    },
    {
      id: "uplift",
      label: bi(lang, "Approval-rate uplift from correct scheme fit (%)", "सही योजना चयन से स्वीकृति दर वृद्धि (%)"),
      value: uplift,
      set: setUplift,
      min: 2,
      max: 45,
      step: 1,
      fmt: (v: number) => `${v}%`,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6 rounded-xl border bg-card p-6">
        {controls.map((c) => (
          <div key={c.id}>
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <label htmlFor={c.id} className="text-sm font-medium">
                {c.label}
              </label>
              <span className="font-mono text-sm font-bold text-saffron">{c.fmt(c.value)}</span>
            </div>
            <Slider
              id={c.id}
              value={[c.value]}
              min={c.min}
              max={c.max}
              step={c.step}
              onValueChange={([v]) => c.set(v ?? c.value)}
              aria-label={c.label}
            />
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          {bi(
            lang,
            "Assumptions: 42% of correctly-matched applicants complete an application; average sanctioned ticket ₹2.4 lakh; opportunity cost of an applicant hour ₹62 (rural non-farm wage benchmark).",
            "अनुमान: सही मिलान वाले 42% आवेदक आवेदन पूरा करते हैं; औसत स्वीकृत राशि ₹2.4 लाख; आवेदक के एक घंटे की अवसर लागत ₹62 (ग्रामीण गैर-कृषि मज़दूरी मानक)।",
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat
          icon={Clock}
          label={bi(lang, "Applicant hours saved / year", "प्रति वर्ष बचे आवेदक घंटे")}
          value={`${(derived.totalHours / 100000).toFixed(1)} L`}
          sub={bi(lang, "No more district-office round trips", "जिला कार्यालय के चक्कर समाप्त")}
        />
        <Stat
          icon={Users}
          label={bi(lang, "Additional approvals", "अतिरिक्त स्वीकृतियाँ")}
          value={derived.extraApprovals.toLocaleString("en-IN")}
          sub={bi(lang, "From applying to the right scheme first", "पहली बार सही योजना चुनने से")}
        />
        <Stat
          icon={IndianRupee}
          label={bi(lang, "Credit & subsidy unlocked", "जारी ऋण एवं सब्सिडी")}
          value={formatINR(derived.creditUnlocked)}
          sub={bi(lang, "Flowing into micro-enterprises", "सूक्ष्म उद्यमों तक पहुँचती राशि")}
        />
        <Stat
          icon={Landmark}
          label={bi(lang, "Wage value of time returned", "लौटाए गए समय का मज़दूरी मूल्य")}
          value={formatINR(derived.wagesSaved)}
          sub={bi(lang, "Time back into the business, not paperwork", "समय कागज़ी काम नहीं, व्यवसाय में")}
        />
        <div className="rounded-xl border bg-emerald-soft p-5 text-emerald sm:col-span-2">
          <p className="text-sm font-semibold">{bi(lang, "Social & digital impact", "सामाजिक एवं डिजिटल प्रभाव")}</p>
          <ul className="mt-2 space-y-1 text-sm opacity-90">
            <li>
              {bi(
                lang,
                "Removes the middleman who charges ₹2,000–₹10,000 to 'get your file passed'.",
                "'फ़ाइल पास कराने' के लिए ₹2,000–₹10,000 लेने वाले बिचौलिये की भूमिका समाप्त।",
              )}
            </li>
            <li>
              {bi(
                lang,
                "Hindi-first interface brings first-generation entrepreneurs onto a digital rail.",
                "हिंदी-प्रथम इंटरफ़ेस पहली पीढ़ी के उद्यमियों को डिजिटल व्यवस्था से जोड़ता है।",
              )}
            </li>
            <li>
              {bi(
                lang,
                "Audit logs give ministries district-level evidence of who is being left out.",
                "ऑडिट लॉग से मंत्रालयों को जिला-स्तर पर वंचित वर्ग का प्रमाण मिलता है।",
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
