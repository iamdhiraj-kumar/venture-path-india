import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

type Dict = Record<string, { en: string; hi: string }>;

const dict: Dict = {
  brand: { en: "Sahayak", hi: "सहायक" },
  brandSub: {
    en: "AI-Driven Scheme Matching for Marginalized Entrepreneurs",
    hi: "वंचित उद्यमियों के लिए एआई-आधारित योजना मिलान",
  },
  navDemo: { en: "Live Demo", hi: "लाइव डेमो" },
  navShowcase: { en: "Pitch & Architecture", hi: "पिच और आर्किटेक्चर" },
  askSahayak: { en: "Ask Sahayak AI", hi: "सहायक एआई से पूछें" },
  heroTag: { en: "Smart India Hackathon 2026 · SIH26092 · Smart Automation", hi: "स्मार्ट इंडिया हैकाथॉन 2026 · SIH26092 · स्मार्ट ऑटोमेशन" },
  heroTitle: {
    en: "Find the right government scheme in 60 seconds — not 60 days.",
    hi: "सही सरकारी योजना 60 दिन में नहीं, 60 सेकंड में खोजें।",
  },
  heroBody: {
    en: "Sahayak reads an entrepreneur's profile, runs it through a deterministic eligibility rule engine, and explains — in plain language — which schemes they qualify for, how much subsidy they can unlock, and exactly what to do next.",
    hi: "सहायक उद्यमी की प्रोफ़ाइल पढ़ता है, उसे नियम-आधारित पात्रता इंजन से जाँचता है, और सरल भाषा में बताता है कि कौन सी योजनाएँ मिलेंगी, कितनी सब्सिडी मिलेगी और आगे क्या करना है।",
  },
  ctaTryPersona: { en: "Try a demo persona", hi: "डेमो प्रोफ़ाइल आज़माएँ" },
  ctaShowcase: { en: "See the architecture", hi: "आर्किटेक्चर देखें" },
  statSchemes: { en: "Schemes mapped", hi: "मैप की गई योजनाएँ" },
  statRules: { en: "Eligibility rules", hi: "पात्रता नियम" },
  statLangs: { en: "Languages planned", hi: "नियोजित भाषाएँ" },
  statTime: { en: "Avg. match time", hi: "औसत मिलान समय" },
  step1: { en: "1 · Choose a persona", hi: "1 · प्रोफ़ाइल चुनें" },
  step1Sub: { en: "Judges can switch profiles instantly and watch results re-rank.", hi: "जज तुरंत प्रोफ़ाइल बदलकर परिणाम बदलते देख सकते हैं।" },
  step2: { en: "2 · Or fill the eligibility questionnaire", hi: "2 · या पात्रता प्रश्नावली भरें" },
  step2Sub: { en: "Every field maps to a real clause in a scheme guideline.", hi: "हर फ़ील्ड किसी योजना दिशानिर्देश के वास्तविक खंड से जुड़ा है।" },
  step3: { en: "3 · Match results", hi: "3 · मिलान परिणाम" },
  runMatch: { en: "Run AI match", hi: "एआई मिलान चलाएँ" },
  reset: { en: "Reset", hi: "रीसेट" },
  matchScore: { en: "Match score", hi: "मिलान स्कोर" },
  whyQualify: { en: "Why you qualify", hi: "आप क्यों पात्र हैं" },
  benefit: { en: "Benefit & subsidy", hi: "लाभ और सब्सिडी" },
  documents: { en: "Document checklist", hi: "दस्तावेज़ सूची" },
  roadmap: { en: "Application roadmap", hi: "आवेदन रोडमैप" },
  explain: { en: "Explain simply", hi: "आसान भाषा में समझाएँ" },
  eligible: { en: "Eligible", hi: "पात्र" },
  partial: { en: "Conditional", hi: "सशर्त" },
  notEligible: { en: "Not eligible", hi: "अपात्र" },
  bestMatch: { en: "Best match", hi: "सर्वोत्तम मिलान" },
  estSupport: { en: "Estimated support unlocked", hi: "अनुमानित सहायता" },
  showAll: { en: "Show schemes you don't qualify for", hi: "अपात्र योजनाएँ भी दिखाएँ" },
  // form
  fName: { en: "Name", hi: "नाम" },
  fCategory: { en: "Social category", hi: "सामाजिक श्रेणी" },
  fGender: { en: "Gender", hi: "लिंग" },
  fPwd: { en: "Differently-abled (PwD)", hi: "दिव्यांग (PwD)" },
  fStage: { en: "Business stage", hi: "व्यवसाय की अवस्था" },
  fState: { en: "State / UT", hi: "राज्य / केंद्र शासित प्रदेश" },
  fArea: { en: "Area", hi: "क्षेत्र" },
  fSector: { en: "Sector", hi: "क्षेत्रक" },
  fTurnover: { en: "Annual turnover (₹)", hi: "वार्षिक कारोबार (₹)" },
  fFunding: { en: "Funding required (₹)", hi: "आवश्यक धनराशि (₹)" },
  fPreference: { en: "Preference", hi: "प्राथमिकता" },
  fAge: { en: "Age", hi: "आयु" },
  // chat
  chatTitle: { en: "Sahayak AI · scheme advisor", hi: "सहायक एआई · योजना सलाहकार" },
  chatSub: { en: "Plain-language answers on schemes and banking jargon", hi: "योजनाओं और बैंकिंग शब्दावली पर सरल भाषा में उत्तर" },
  chatPlaceholder: { en: "Ask about a scheme, subsidy or a bank term…", hi: "किसी योजना, सब्सिडी या बैंक शब्द के बारे में पूछें…" },
  chatSend: { en: "Send", hi: "भेजें" },
  chatSuggested: { en: "Try asking", hi: "ये पूछकर देखें" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string };

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const value = useMemo<Ctx>(
    () => ({ lang, setLang, t: (k) => dict[k]?.[lang] ?? String(k) }),
    [lang],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

/** Pick the right side of a bilingual pair. */
export function bi(lang: Lang, en: string, hi: string) {
  return lang === "hi" ? hi : en;
}

export function formatINR(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}
