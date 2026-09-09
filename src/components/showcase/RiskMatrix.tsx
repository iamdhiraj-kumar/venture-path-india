import { Badge } from "@/components/ui/badge";
import { bi, useLang } from "@/lib/i18n";

type Level = "high" | "medium" | "low";

const RISKS: {
  en: string;
  hi: string;
  likelihood: Level;
  impact: Level;
  mitEn: string;
  mitHi: string;
}[] = [
  {
    en: "Eligibility rules change mid-year (budget revisions, new circulars)",
    hi: "वर्ष के बीच पात्रता नियम बदलना (बजट संशोधन, नए परिपत्र)",
    likelihood: "high",
    impact: "high",
    mitEn: "Rules stored as versioned rows with an effective-from date, never hard-coded. A nightly diff worker flags changed ceilings for human review, and past matches remain replayable from the audit log.",
    mitHi: "नियम प्रभावी-तिथि सहित संस्करण-आधारित पंक्तियों में, कोड में नहीं। रात्रिकालीन डिफ़ वर्कर बदली सीमाएँ समीक्षा हेतु चिह्नित करता है; पुराने मिलान ऑडिट लॉग से दोहराए जा सकते हैं।",
  },
  {
    en: "Official portals have no open API; data drifts from source",
    hi: "आधिकारिक पोर्टलों पर खुला एपीआई नहीं; डेटा स्रोत से भटकता है",
    likelihood: "high",
    impact: "medium",
    mitEn: "Every clause row stores its source URL and fetch timestamp, shown to the user. Where myScheme APIs exist we consume them; elsewhere resilient scrapers plus a manual override console for the scheme desk.",
    mitHi: "हर खंड में स्रोत लिंक और तिथि दर्ज, उपयोगकर्ता को दिखाई देती है। जहाँ myScheme एपीआई उपलब्ध हैं वहाँ उनका उपयोग; अन्यत्र स्क्रेपर और मैनुअल ओवरराइड कंसोल।",
  },
  {
    en: "LLM hallucinates an eligibility promise the applicant relies on",
    hi: "एलएलएम पात्रता का झूठा वादा कर दे जिस पर आवेदक भरोसा कर ले",
    likelihood: "medium",
    impact: "high",
    mitEn: "The model has no authority over the verdict. It only paraphrases the rule engine's output and cited clauses; unsupported claims are filtered by a grounding check before display.",
    mitHi: "निर्णय पर मॉडल का अधिकार नहीं। वह केवल नियम इंजन के परिणाम और उद्धृत खंडों की व्याख्या करता है; असमर्थित दावे प्रदर्शन से पहले छाँट दिए जाते हैं।",
  },
  {
    en: "Low digital literacy and language barriers among target users",
    hi: "लक्षित उपयोगकर्ताओं में कम डिजिटल साक्षरता और भाषा बाधा",
    likelihood: "high",
    impact: "medium",
    mitEn: "Icon-led questionnaire, 12 fields maximum, voice input on the roadmap, and delivery through CSC operators and SHG facilitators who already assist these entrepreneurs.",
    mitHi: "आइकन-आधारित प्रश्नावली, अधिकतम 12 फ़ील्ड, रोडमैप में वॉइस इनपुट, और सीएससी संचालकों व एसएचजी सहायकों के माध्यम से पहुँच।",
  },
  {
    en: "State-level schemes multiply the rule surface beyond central schemes",
    hi: "राज्य योजनाएँ नियमों का दायरा केंद्रीय योजनाओं से कहीं आगे बढ़ा देती हैं",
    likelihood: "medium",
    impact: "medium",
    mitEn: "Rules authored in a declarative YAML DSL, not code, so a non-engineer scheme analyst can onboard a state scheme in under an hour. Vector search covers the long tail until rules are written.",
    mitHi: "नियम कोड नहीं, घोषणात्मक YAML DSL में लिखे जाते हैं, ताकि गैर-इंजीनियर विश्लेषक एक घंटे में राज्य योजना जोड़ सके। नियम बनने तक वेक्टर खोज लंबी पूँछ संभालती है।",
  },
  {
    en: "Data privacy of caste, disability and income information",
    hi: "जाति, दिव्यांगता और आय जानकारी की निजता",
    likelihood: "medium",
    impact: "high",
    mitEn: "Profiles are processed in-memory and hashed for caching; no PII is required to run a match. Consent-first storage only when the user chooses to save an application draft.",
    mitHi: "प्रोफ़ाइल मेमोरी में संसाधित और कैश हेतु हैश की जाती है; मिलान के लिए व्यक्तिगत पहचान आवश्यक नहीं। ड्राफ़्ट सहेजने पर ही सहमति-आधारित भंडारण।",
  },
];

const tone: Record<Level, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/15 text-warning-foreground",
  low: "bg-emerald-soft text-emerald",
};

const labels: Record<Level, { en: string; hi: string }> = {
  high: { en: "High", hi: "उच्च" },
  medium: { en: "Medium", hi: "मध्यम" },
  low: { en: "Low", hi: "निम्न" },
};

export function RiskMatrix() {
  const { lang } = useLang();
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="hidden grid-cols-[1.4fr_auto_auto_2fr] gap-4 border-b bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid">
        <span>{bi(lang, "Risk", "जोखिम")}</span>
        <span>{bi(lang, "Likelihood", "संभावना")}</span>
        <span>{bi(lang, "Impact", "प्रभाव")}</span>
        <span>{bi(lang, "Mitigation", "समाधान")}</span>
      </div>
      <ul className="divide-y">
        {RISKS.map((r) => (
          <li key={r.en} className="grid gap-3 px-5 py-4 lg:grid-cols-[1.4fr_auto_auto_2fr] lg:items-start lg:gap-4">
            <p className="font-medium">{bi(lang, r.en, r.hi)}</p>
            <Badge variant="secondary" className={`w-fit ${tone[r.likelihood]}`}>
              {bi(lang, labels[r.likelihood].en, labels[r.likelihood].hi)}
            </Badge>
            <Badge variant="secondary" className={`w-fit ${tone[r.impact]}`}>
              {bi(lang, labels[r.impact].en, labels[r.impact].hi)}
            </Badge>
            <p className="text-sm text-muted-foreground">{bi(lang, r.mitEn, r.mitHi)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
