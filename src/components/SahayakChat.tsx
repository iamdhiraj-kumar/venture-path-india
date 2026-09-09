import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SCHEMES } from "@/data/schemes";
import { bi, useLang, type Lang } from "@/lib/i18n";

type Msg = { role: "user" | "bot"; text: string };

type SahayakCtx = { open: (question?: string) => void };
const Ctx = createContext<SahayakCtx | null>(null);

export function useSahayak() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSahayak must be used inside SahayakProvider");
  return ctx;
}

const JARGON: { keys: string[]; en: string; hi: string }[] = [
  {
    keys: ["collateral", "security", "गिरवी", "जमानत"],
    en: "**Collateral** is property — land, gold, a shop — the bank can sell if you cannot repay. Schemes like Mudra, PM SVANidhi and CGTMSE-backed loans need none of it.",
    hi: "**गिरवी (कोलैटरल)** वह संपत्ति है — ज़मीन, सोना, दुकान — जिसे न चुका पाने पर बैंक बेच सकता है। मुद्रा, पीएम स्वनिधि और सीजीटीएमएसई-समर्थित ऋण में इसकी ज़रूरत नहीं।",
  },
  {
    keys: ["margin money", "margin", "मार्जिन"],
    en: "**Margin money** is the part of the project you fund yourself. In PMEGP the government converts a big slice of it into a subsidy — 15% to 35% — which you never repay if you run the unit for 3 years.",
    hi: "**मार्जिन मनी** परियोजना का वह हिस्सा है जो आप स्वयं लगाते हैं। पीएमईजीपी में सरकार इसका बड़ा भाग सब्सिडी में बदल देती है — 15% से 35% — जिसे 3 वर्ष इकाई चलाने पर लौटाना नहीं पड़ता।",
  },
  {
    keys: ["moratorium", "मोहलत"],
    en: "**Moratorium** is a holiday from repayment. Stand-Up India gives up to 18 months — your business starts earning before the first EMI is due.",
    hi: "**मोहलत (मोरेटोरियम)** चुकौती से छूट की अवधि है। स्टैंड-अप इंडिया में 18 माह तक — पहली किश्त से पहले व्यवसाय कमाने लगता है।",
  },
  {
    keys: ["subvention", "interest subsidy", "ब्याज सहायता", "सब्सिडी"],
    en: "**Interest subvention** means the government pays part of your interest directly into your loan account. PM SVANidhi pays 7%; the Agri Infrastructure Fund pays 3% for seven years.",
    hi: "**ब्याज सहायता** का अर्थ है सरकार आपके ब्याज का एक हिस्सा सीधे ऋण खाते में जमा करती है। पीएम स्वनिधि 7% देती है; कृषि अवसंरचना निधि सात वर्ष तक 3%।",
  },
  {
    keys: ["udyam", "उद्यम"],
    en: "**Udyam registration** is the free online MSME identity number. It takes 10 minutes with Aadhaar and PAN, and most schemes and CGTMSE cover need it.",
    hi: "**उद्यम पंजीकरण** निःशुल्क ऑनलाइन एमएसएमई पहचान संख्या है। आधार और पैन से 10 मिनट में हो जाता है, और अधिकांश योजनाओं तथा सीजीटीएमएसई कवर हेतु आवश्यक है।",
  },
  {
    keys: ["cibil", "credit score", "क्रेडिट स्कोर", "सिबिल"],
    en: "**Credit score (CIBIL)** is a 300–900 number showing your repayment history. Below 650 banks hesitate. No history at all is not a rejection — Shishu Mudra and SVANidhi are designed for first-time borrowers.",
    hi: "**क्रेडिट स्कोर (सिबिल)** 300–900 के बीच की संख्या है जो चुकौती इतिहास दर्शाती है। 650 से कम पर बैंक हिचकते हैं। इतिहास न होना अस्वीकृति नहीं — शिशु मुद्रा और स्वनिधि पहली बार उधार लेने वालों के लिए ही हैं।",
  },
  {
    keys: ["dpr", "project report", "परियोजना रिपोर्ट"],
    en: "**DPR / project report** is a simple document: what you will buy, what it costs, what you will earn each month, and how you will repay. DIC offices and KVIC provide free templates.",
    hi: "**डीपीआर / परियोजना रिपोर्ट** एक सरल दस्तावेज़ है: आप क्या खरीदेंगे, लागत कितनी होगी, हर माह कितनी कमाई होगी और चुकौती कैसे करेंगे। डीआईसी और केवीआईसी निःशुल्क प्रारूप देते हैं।",
  },
  {
    keys: ["guarantee fee", "cgtmse fee"],
    en: "**Guarantee fee** is the small annual charge (0.37%–1.35%) paid so the CGTMSE trust stands behind your loan instead of collateral.",
    hi: "**गारंटी शुल्क** छोटा वार्षिक शुल्क (0.37%–1.35%) है, जिसके बदले सीजीटीएमएसई ट्रस्ट गिरवी के स्थान पर आपके ऋण की गारंटी देता है।",
  },
];

function respond(q: string, lang: Lang): string {
  const query = q.toLowerCase();

  const scheme = SCHEMES.find(
    (s) =>
      query.includes(s.id) ||
      s.name.toLowerCase().split(/[^a-z]+/).some((w) => w.length > 4 && query.includes(w)) ||
      query.includes(s.nameHi),
  );
  if (scheme) {
    const plain = bi(lang, scheme.plainEn, scheme.plainHi);
    const docs = scheme.documents.slice(0, 3).map((d) => `• ${bi(lang, d.en, d.hi)}`).join("\n");
    return `**${bi(lang, scheme.name, scheme.nameHi)}**\n\n${plain}\n\n${bi(lang, "You will need:", "आपको चाहिए होगा:")}\n${docs}`;
  }

  const jargon = JARGON.find((j) => j.keys.some((k) => query.includes(k)));
  if (jargon) return bi(lang, jargon.en, jargon.hi);

  if (/(document|कागज|दस्तावे)/.test(query)) {
    return bi(
      lang,
      "Almost every scheme asks for the same core set: Aadhaar, PAN, a bank passbook, a caste or disability certificate if you are claiming that category, and a one-page project report. Keep scanned copies under 200 KB each — most portals reject bigger files.",
      "लगभग हर योजना में एक जैसे मूल दस्तावेज़ लगते हैं: आधार, पैन, बैंक पासबुक, श्रेणी का दावा करने पर जाति या दिव्यांगता प्रमाणपत्र, और एक-पृष्ठ परियोजना रिपोर्ट। स्कैन प्रतियाँ 200 केबी से कम रखें — अधिकांश पोर्टल बड़ी फ़ाइलें अस्वीकार करते हैं।",
    );
  }
  if (/(reject|denied|अस्वीकार|मना)/.test(query)) {
    return bi(
      lang,
      "The three most common rejection reasons are: an incomplete project report, a mismatch between the category certificate and the applicant's name, and applying to a scheme meant for new units when the unit already exists. Sahayak flags all three before you submit.",
      "अस्वीकृति के तीन सबसे सामान्य कारण: अधूरी परियोजना रिपोर्ट, श्रेणी प्रमाणपत्र और आवेदक के नाम में अंतर, और मौजूदा इकाई होते हुए नई इकाई वाली योजना में आवेदन। सहायक तीनों को आवेदन से पहले बताता है।",
    );
  }

  return bi(
    lang,
    "I can explain any scheme in your match list, decode a banking term like collateral, margin money, moratorium or CIBIL, or tell you which documents to keep ready. Try naming a scheme — for example, \"explain CGTMSE\".",
    "मैं आपकी सूची की किसी भी योजना को समझा सकता हूँ, कोलैटरल, मार्जिन मनी, मोहलत या सिबिल जैसे बैंकिंग शब्द आसान कर सकता हूँ, या बता सकता हूँ कि कौन से दस्तावेज़ तैयार रखें। कोई योजना नाम लेकर पूछें — जैसे \"सीजीटीएमएसई समझाएँ\"।",
  );
}

function renderRich(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() === "" ? "h-2" : "leading-relaxed"}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={j}>{part}</span>
        ),
      )}
    </p>
  ));
}

export function SahayakProvider({ children }: { children: ReactNode }) {
  const { lang, t } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const ask = useCallback(
    (question: string) => {
      setMessages((m) => [...m, { role: "user", text: question }]);
      setTyping(true);
      window.setTimeout(() => {
        setMessages((m) => [...m, { role: "bot", text: respond(question, lang) }]);
        setTyping(false);
      }, 550);
    },
    [lang],
  );

  const open = useCallback(
    (question?: string) => {
      setIsOpen(true);
      if (question) ask(question);
    },
    [ask],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    if (isOpen) inputRef.current?.focus();
  }, [messages, isOpen, typing]);

  const suggestions = useMemo(
    () =>
      lang === "hi"
        ? ["पीएमईजीपी समझाएँ", "कोलैटरल क्या है?", "मार्जिन मनी", "कौन से दस्तावेज़ चाहिए?"]
        : ["Explain PMEGP", "What is collateral?", "What is margin money?", "Which documents do I need?"],
    [lang],
  );

  const value = useMemo<SahayakCtx>(() => ({ open }), [open]);

  return (
    <Ctx.Provider value={value}>
      {children}

      <Button
        onClick={() => open()}
        className="fixed bottom-5 right-5 z-40 h-12 gap-2 rounded-full bg-emerald px-5 text-emerald-foreground shadow-lg hover:bg-emerald/90"
      >
        <Sparkles aria-hidden />
        <span className="hidden sm:inline">{t("askSahayak")}</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b bg-surface px-5 py-4 text-left">
            <SheetTitle className="flex items-center gap-2 text-base">
              <span className="grid size-8 place-items-center rounded-full bg-emerald text-emerald-foreground">
                <Bot className="size-4" aria-hidden />
              </span>
              {t("chatTitle")}
            </SheetTitle>
            <SheetDescription>{t("chatSub")}</SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-sm">
            {messages.length === 0 && (
              <div className="rounded-lg border border-dashed p-4 text-muted-foreground">
                {bi(
                  lang,
                  "Namaste! I'm Sahayak. Ask me about any scheme in plain words — I will skip the government language.",
                  "नमस्ते! मैं सहायक हूँ। किसी भी योजना के बारे में सरल शब्दों में पूछें — मैं सरकारी भाषा छोड़ दूँगा।",
                )}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex gap-2"}>
                {m.role === "bot" && (
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-emerald-soft text-emerald">
                    <Bot className="size-4" aria-hidden />
                  </span>
                )}
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-primary-foreground"
                      : "max-w-[95%] space-y-1 text-foreground/90"
                  }
                >
                  {m.role === "user" ? (
                    <span className="inline-flex items-start gap-2">
                      <User className="mt-0.5 size-3.5 shrink-0 opacity-70" aria-hidden />
                      {m.text}
                    </span>
                  ) : (
                    renderRich(m.text)
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <p className="animate-pulse text-muted-foreground">
                {bi(lang, "Sahayak is thinking…", "सहायक सोच रहा है…")}
              </p>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t bg-surface px-5 py-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("chatSuggested")}</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs transition-colors hover:border-emerald hover:text-emerald"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!input.trim()) return;
                ask(input.trim());
                setInput("");
              }}
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatPlaceholder")}
                aria-label={t("chatPlaceholder")}
              />
              <Button type="submit" size="icon" aria-label={t("chatSend")}>
                <Send aria-hidden />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </Ctx.Provider>
  );
}
