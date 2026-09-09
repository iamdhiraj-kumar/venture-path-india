export type Category = "SC" | "ST" | "OBC" | "General" | "Minority";
export type Stage = "idea" | "new" | "existing" | "expansion";
export type Sector = "manufacturing" | "service" | "trading" | "agri" | "artisan" | "street-vendor";
export type Preference = "loan" | "grant" | "any";

export type Profile = {
  name: string;
  category: Category;
  gender: "female" | "male" | "other";
  pwd: boolean;
  stage: Stage;
  state: string;
  area: "rural" | "urban";
  sector: Sector;
  turnover: number;
  funding: number;
  preference: Preference;
  age: number;
};

export type Criterion = {
  en: string;
  hi: string;
  weight: number;
  /** A hard clause: failing it makes the applicant ineligible today. */
  hard?: boolean;
  test: (p: Profile) => "yes" | "partial" | "no";
};

export type Scheme = {
  id: string;
  name: string;
  nameHi: string;
  ministry: string;
  ministryHi: string;
  type: "loan" | "subsidy" | "credit-guarantee" | "grant";
  tagline: string;
  taglineHi: string;
  ceiling: number;
  benefits: { en: string; hi: string }[];
  /** Estimated money unlocked for this profile. */
  subsidy: (p: Profile) => { amount: number; en: string; hi: string };
  documents: { en: string; hi: string }[];
  roadmap: { en: string; hi: string; detailEn: string; detailHi: string }[];
  criteria: Criterion[];
  plainEn: string;
  plainHi: string;
};

const clamp = (v: number, max: number) => Math.max(0, Math.min(v, max));

export const SCHEMES: Scheme[] = [
  {
    id: "pmegp",
    name: "PMEGP",
    nameHi: "पीएमईजीपी",
    ministry: "Ministry of MSME · KVIC",
    ministryHi: "एमएसएमई मंत्रालय · केवीआईसी",
    type: "subsidy",
    tagline: "Credit-linked capital subsidy to set up a new micro-enterprise.",
    taglineHi: "नया सूक्ष्म उद्यम शुरू करने के लिए ऋण-संबद्ध पूंजी सब्सिडी।",
    ceiling: 5000000,
    benefits: [
      { en: "Margin money subsidy of 15–35% of project cost", hi: "परियोजना लागत का 15–35% मार्जिन मनी सब्सिडी" },
      { en: "Up to ₹50 lakh for manufacturing, ₹20 lakh for service units", hi: "विनिर्माण के लिए ₹50 लाख तक, सेवा इकाई के लिए ₹20 लाख तक" },
      { en: "Own contribution only 5% for special categories", hi: "विशेष श्रेणियों के लिए स्वयं का अंशदान केवल 5%" },
    ],
    subsidy: (p) => {
      const cap = p.sector === "manufacturing" ? 5000000 : 2000000;
      const project = clamp(p.funding, cap);
      const special = p.category !== "General" || p.gender === "female" || p.pwd;
      const rate = special ? (p.area === "rural" ? 0.35 : 0.25) : p.area === "rural" ? 0.25 : 0.15;
      return {
        amount: Math.round(project * rate),
        en: `${Math.round(rate * 100)}% margin money subsidy on a ${p.area} ${p.sector} project`,
        hi: `${p.area === "rural" ? "ग्रामीण" : "शहरी"} परियोजना पर ${Math.round(rate * 100)}% मार्जिन मनी सब्सिडी`,
      };
    },
    documents: [
      { en: "Aadhaar & PAN", hi: "आधार और पैन" },
      { en: "Project report with cost breakdown", hi: "लागत विवरण सहित परियोजना रिपोर्ट" },
      { en: "Caste / special-category certificate (if claimed)", hi: "जाति / विशेष श्रेणी प्रमाणपत्र (यदि दावा किया गया हो)" },
      { en: "Education certificate (for projects above ₹10 lakh)", hi: "शैक्षिक प्रमाणपत्र (₹10 लाख से अधिक की परियोजना हेतु)" },
      { en: "Rural area certificate from Gram Panchayat", hi: "ग्राम पंचायत से ग्रामीण क्षेत्र प्रमाणपत्र" },
    ],
    roadmap: [
      { en: "Register on the PMEGP e-portal", hi: "पीएमईजीपी ई-पोर्टल पर पंजीकरण करें", detailEn: "Create an applicant login with Aadhaar-linked mobile.", detailHi: "आधार से जुड़े मोबाइल से आवेदक लॉगिन बनाएँ।" },
      { en: "Upload the project report", hi: "परियोजना रिपोर्ट अपलोड करें", detailEn: "Machinery, working capital and a 3-year cash flow.", detailHi: "मशीनरी, कार्यशील पूंजी और 3-वर्षीय नकदी प्रवाह।" },
      { en: "District Task Force interview", hi: "जिला टास्क फोर्स साक्षात्कार", detailEn: "A 10-minute viva on your business plan.", detailHi: "आपकी व्यवसाय योजना पर 10 मिनट का साक्षात्कार।" },
      { en: "Bank appraisal & sanction", hi: "बैंक मूल्यांकन और स्वीकृति", detailEn: "Bank sanctions the loan; subsidy is kept in a lock-in account.", detailHi: "बैंक ऋण स्वीकृत करता है; सब्सिडी लॉक-इन खाते में रहती है।" },
      { en: "EDP training & disbursal", hi: "ईडीपी प्रशिक्षण और वितरण", detailEn: "Complete 2-week EDP training, then funds release.", detailHi: "2 सप्ताह का ईडीपी प्रशिक्षण पूरा करें, फिर राशि जारी।" },
    ],
    criteria: [
      { en: "Age 18 or above", hi: "आयु 18 वर्ष या अधिक", weight: 2, hard: true, test: (p) => (p.age >= 18 ? "yes" : "no") },
      { en: "New unit — PMEGP does not fund existing units", hi: "नई इकाई — पीएमईजीपी मौजूदा इकाई को वित्त नहीं देता", weight: 4, hard: true, test: (p) => (p.stage === "idea" || p.stage === "new" ? "yes" : "no") },
      { en: "Project cost within sector ceiling", hi: "परियोजना लागत क्षेत्रवार सीमा के भीतर", weight: 3, test: (p) => (p.funding <= (p.sector === "manufacturing" ? 5000000 : 2000000) ? "yes" : "partial") },
      { en: "Special category (SC/ST/OBC/Women/PwD) — higher subsidy", hi: "विशेष श्रेणी (एससी/एसटी/ओबीसी/महिला/दिव्यांग) — अधिक सब्सिडी", weight: 3, test: (p) => (p.category !== "General" || p.gender === "female" || p.pwd ? "yes" : "partial") },
      { en: "Rural location — 35% subsidy slab", hi: "ग्रामीण स्थान — 35% सब्सिडी स्लैब", weight: 2, test: (p) => (p.area === "rural" ? "yes" : "partial") },
      { en: "Subsidy-oriented, matches grant preference", hi: "सब्सिडी-आधारित, अनुदान प्राथमिकता से मेल", weight: 2, test: (p) => (p.preference === "loan" ? "partial" : "yes") },
    ],
    plainEn:
      "PMEGP gives you a bank loan where the government pays a big chunk of it for you — 15% to 35% depending on who you are and where you live. That paid part is called 'margin money subsidy' and you never repay it, as long as you run the unit for 3 years.",
    plainHi:
      "पीएमईजीपी में बैंक ऋण मिलता है और उसका बड़ा हिस्सा सरकार चुकाती है — आपकी श्रेणी और स्थान के अनुसार 15% से 35% तक। इसे 'मार्जिन मनी सब्सिडी' कहते हैं और यदि आप 3 वर्ष तक इकाई चलाते हैं तो इसे लौटाना नहीं पड़ता।",
  },
  {
    id: "svanidhi",
    name: "PM SVANidhi",
    nameHi: "पीएम स्वनिधि",
    ministry: "Ministry of Housing & Urban Affairs",
    ministryHi: "आवासन और शहरी कार्य मंत्रालय",
    type: "loan",
    tagline: "Collateral-free working capital ladder for urban street vendors.",
    taglineHi: "शहरी रेहड़ी-पटरी विक्रेताओं के लिए बिना गारंटी कार्यशील पूंजी।",
    ceiling: 50000,
    benefits: [
      { en: "₹10,000 → ₹20,000 → ₹50,000 ladder on timely repayment", hi: "समय पर चुकौती पर ₹10,000 → ₹20,000 → ₹50,000 की सीढ़ी" },
      { en: "7% interest subsidy credited to your account", hi: "7% ब्याज सब्सिडी सीधे खाते में" },
      { en: "Cashback up to ₹1,200/year for digital transactions", hi: "डिजिटल लेनदेन पर ₹1,200/वर्ष तक कैशबैक" },
    ],
    subsidy: (p) => {
      const loan = clamp(p.funding, 50000);
      return {
        amount: Math.round(loan * 0.07) + 1200,
        en: "7% interest subvention + digital-transaction cashback",
        hi: "7% ब्याज सहायता + डिजिटल लेनदेन कैशबैक",
      };
    },
    documents: [
      { en: "Certificate of Vending / Town Vending Committee ID", hi: "वेंडिंग प्रमाणपत्र / टीवीसी पहचान पत्र" },
      { en: "Aadhaar linked to mobile", hi: "मोबाइल से जुड़ा आधार" },
      { en: "Bank account & passbook", hi: "बैंक खाता और पासबुक" },
      { en: "Letter of Recommendation (if no vending certificate)", hi: "अनुशंसा पत्र (यदि वेंडिंग प्रमाणपत्र न हो)" },
    ],
    roadmap: [
      { en: "Get vendor identity verified", hi: "विक्रेता पहचान सत्यापित कराएँ", detailEn: "Approach the Urban Local Body / TVC.", detailHi: "शहरी निकाय / टीवीसी से संपर्क करें।" },
      { en: "Apply on pmsvanidhi.mohua.gov.in", hi: "pmsvanidhi.mohua.gov.in पर आवेदन", detailEn: "Fill the one-page form with Aadhaar OTP.", detailHi: "आधार ओटीपी से एक-पृष्ठ फ़ॉर्म भरें।" },
      { en: "Lender allocation", hi: "ऋणदाता आवंटन", detailEn: "A bank, NBFC or SHG-federation is auto-assigned.", detailHi: "बैंक, एनबीएफसी या एसएचजी स्वतः आवंटित।" },
      { en: "Repay on time, climb the ladder", hi: "समय पर चुकाएँ, अगली किश्त पाएँ", detailEn: "Timely closure unlocks the next tranche automatically.", detailHi: "समय पर चुकौती से अगली किश्त स्वतः मिलती है।" },
    ],
    criteria: [
      { en: "Street vending as the livelihood", hi: "आजीविका के रूप में रेहड़ी-पटरी व्यवसाय", weight: 5, hard: true, test: (p) => (p.sector === "street-vendor" ? "yes" : "no") },
      { en: "Urban / peri-urban vending area", hi: "शहरी / उप-शहरी वेंडिंग क्षेत्र", weight: 3, test: (p) => (p.area === "urban" ? "yes" : "partial") },
      { en: "Requirement within the ₹50,000 ceiling", hi: "आवश्यकता ₹50,000 की सीमा में", weight: 3, test: (p) => (p.funding <= 50000 ? "yes" : "partial") },
      { en: "Existing vendor with turnover history", hi: "मौजूदा विक्रेता, कारोबार का इतिहास", weight: 2, test: (p) => (p.stage === "existing" || p.stage === "expansion" ? "yes" : "partial") },
      { en: "Loan product — matches credit preference", hi: "ऋण उत्पाद — क्रेडिट प्राथमिकता से मेल", weight: 2, test: (p) => (p.preference === "grant" ? "partial" : "yes") },
    ],
    plainEn:
      "SVANidhi is a small working-capital loan for street vendors with no security asked. Start at ₹10,000; repay on time and the next loan doubles. The 7% 'interest subvention' means the government pays that part of your interest straight into your account.",
    plainHi:
      "स्वनिधि रेहड़ी-पटरी विक्रेताओं के लिए बिना गारंटी छोटा कार्यशील पूंजी ऋण है। ₹10,000 से शुरू करें; समय पर चुकाने पर अगली राशि दोगुनी। 7% 'ब्याज सहायता' का अर्थ है कि उतना ब्याज सरकार आपके खाते में डालती है।",
  },
  {
    id: "vishwakarma",
    name: "PM Vishwakarma",
    nameHi: "पीएम विश्वकर्मा",
    ministry: "Ministry of MSME",
    ministryHi: "एमएसएमई मंत्रालय",
    type: "subsidy",
    tagline: "Toolkit grant, skilling stipend and collateral-free credit for 18 traditional trades.",
    taglineHi: "18 पारंपरिक व्यवसायों हेतु टूलकिट अनुदान, प्रशिक्षण भत्ता और बिना गारंटी ऋण।",
    ceiling: 300000,
    benefits: [
      { en: "₹15,000 e-voucher for a modern toolkit", hi: "आधुनिक टूलकिट हेतु ₹15,000 ई-वाउचर" },
      { en: "₹500/day stipend during skill training", hi: "प्रशिक्षण के दौरान ₹500/दिन भत्ता" },
      { en: "₹1 lakh then ₹2 lakh credit at 5% interest", hi: "5% ब्याज पर ₹1 लाख फिर ₹2 लाख ऋण" },
    ],
    subsidy: () => ({
      amount: 15000 + 7500,
      en: "₹15,000 toolkit grant + ~₹7,500 training stipend, plus 5% concessional credit",
      hi: "₹15,000 टूलकिट अनुदान + लगभग ₹7,500 प्रशिक्षण भत्ता, साथ में 5% रियायती ऋण",
    }),
    documents: [
      { en: "Aadhaar & mobile for biometric enrolment", hi: "बायोमेट्रिक नामांकन हेतु आधार और मोबाइल" },
      { en: "Trade self-declaration verified by Gram Panchayat / ULB", hi: "ग्राम पंचायत / शहरी निकाय द्वारा सत्यापित व्यवसाय स्व-घोषणा" },
      { en: "Bank account details", hi: "बैंक खाता विवरण" },
      { en: "Ration card / family details", hi: "राशन कार्ड / पारिवारिक विवरण" },
    ],
    roadmap: [
      { en: "Enrol at a Common Service Centre", hi: "कॉमन सर्विस सेंटर पर नामांकन", detailEn: "Biometric registration under one of the 18 trades.", detailHi: "18 व्यवसायों में से एक के तहत बायोमेट्रिक पंजीकरण।" },
      { en: "Three-stage verification", hi: "तीन-स्तरीय सत्यापन", detailEn: "Panchayat/ULB → District Committee → Screening Committee.", detailHi: "पंचायत/निकाय → जिला समिति → स्क्रीनिंग समिति।" },
      { en: "Receive Vishwakarma certificate & ID", hi: "विश्वकर्मा प्रमाणपत्र और आईडी प्राप्त करें", detailEn: "Digital ID unlocks all benefits.", detailHi: "डिजिटल आईडी से सभी लाभ मिलते हैं।" },
      { en: "Basic training + toolkit voucher", hi: "बेसिक प्रशिक्षण + टूलकिट वाउचर", detailEn: "5–7 days training with daily stipend.", detailHi: "5–7 दिन का प्रशिक्षण, दैनिक भत्ते सहित।" },
      { en: "Apply for the ₹1 lakh credit tranche", hi: "₹1 लाख की ऋण किश्त हेतु आवेदन", detailEn: "Collateral-free, 5% interest, 18-month tenure.", detailHi: "बिना गारंटी, 5% ब्याज, 18 माह अवधि।" },
    ],
    criteria: [
      { en: "Artisan / craftsperson in a listed traditional trade", hi: "सूचीबद्ध पारंपरिक व्यवसाय का कारीगर", weight: 5, hard: true, test: (p) => (p.sector === "artisan" ? "yes" : "no") },
      { en: "Age 18 or above", hi: "आयु 18 वर्ष या अधिक", weight: 2, hard: true, test: (p) => (p.age >= 18 ? "yes" : "no") },
      { en: "Family-based, self-employed unit", hi: "परिवार-आधारित स्वरोजगार इकाई", weight: 3, test: (p) => (p.turnover <= 1000000 ? "yes" : "partial") },
      { en: "Credit need within ₹3 lakh two-tranche limit", hi: "ऋण आवश्यकता ₹3 लाख की दो-किश्त सीमा में", weight: 2, test: (p) => (p.funding <= 300000 ? "yes" : "partial") },
      { en: "Rural / small-town artisan cluster", hi: "ग्रामीण / छोटे शहर का कारीगर समूह", weight: 2, test: (p) => (p.area === "rural" ? "yes" : "partial") },
    ],
    plainEn:
      "If you work with your hands in a traditional trade — weaving, pottery, carpentry, tailoring — this scheme first gives you free tools worth ₹15,000, pays you to train, and only then offers cheap credit. Nothing has to be pledged as security.",
    plainHi:
      "यदि आप बुनाई, मिट्टी के बर्तन, बढ़ईगीरी, सिलाई जैसे पारंपरिक हस्तकार्य करते हैं, तो यह योजना पहले ₹15,000 के मुफ़्त औज़ार देती है, प्रशिक्षण का भत्ता देती है, और फिर सस्ता ऋण देती है। कोई गारंटी गिरवी नहीं रखनी पड़ती।",
  },
  {
    id: "standup",
    name: "Stand-Up India",
    nameHi: "स्टैंड-अप इंडिया",
    ministry: "Department of Financial Services",
    ministryHi: "वित्तीय सेवाएँ विभाग",
    type: "loan",
    tagline: "₹10 lakh–₹1 crore composite loan for SC/ST and women entrepreneurs.",
    taglineHi: "एससी/एसटी और महिला उद्यमियों हेतु ₹10 लाख–₹1 करोड़ का समग्र ऋण।",
    ceiling: 10000000,
    benefits: [
      { en: "Composite loan covering 85% of project cost", hi: "परियोजना लागत के 85% तक समग्र ऋण" },
      { en: "Repayment up to 7 years with 18-month moratorium", hi: "18 माह की मोहलत के साथ 7 वर्ष तक चुकौती" },
      { en: "Handholding support via Standupmitra portal", hi: "स्टैंडअपमित्र पोर्टल के माध्यम से सहयोग" },
    ],
    subsidy: (p) => {
      const loan = clamp(Math.max(p.funding, 1000000), 10000000);
      return {
        amount: Math.round(loan * 0.85),
        en: "Composite loan up to 85% of project cost, greenfield unit",
        hi: "ग्रीनफ़ील्ड इकाई हेतु परियोजना लागत के 85% तक समग्र ऋण",
      };
    },
    documents: [
      { en: "Caste certificate (SC/ST applicants)", hi: "जाति प्रमाणपत्र (एससी/एसटी आवेदक)" },
      { en: "Detailed project report & quotations", hi: "विस्तृत परियोजना रिपोर्ट और कोटेशन" },
      { en: "Proof of first-time (greenfield) venture", hi: "पहली बार (ग्रीनफ़ील्ड) उद्यम का प्रमाण" },
      { en: "Udyam registration", hi: "उद्यम पंजीकरण" },
      { en: "Bank statements & ITR (if any)", hi: "बैंक विवरण और आईटीआर (यदि हों)" },
    ],
    roadmap: [
      { en: "Register on Standupmitra", hi: "स्टैंडअपमित्र पर पंजीकरण", detailEn: "Choose handholding agency support if new to business.", detailHi: "नए उद्यमी सहयोग एजेंसी चुन सकते हैं।" },
      { en: "Prepare a bankable DPR", hi: "बैंक-योग्य डीपीआर तैयार करें", detailEn: "Project cost, margin, projections for 5 years.", detailHi: "परियोजना लागत, मार्जिन, 5 वर्ष का अनुमान।" },
      { en: "Bank branch application", hi: "बैंक शाखा में आवेदन", detailEn: "Every scheduled commercial bank branch must fund one SC/ST and one woman borrower.", detailHi: "प्रत्येक शाखा को एक एससी/एसटी और एक महिला उधारकर्ता को ऋण देना होता है।" },
      { en: "Sanction with CGFSIL guarantee", hi: "सीजीएफएसआईएल गारंटी सहित स्वीकृति", detailEn: "Credit guarantee replaces collateral.", detailHi: "क्रेडिट गारंटी गारंटी-संपत्ति की जगह लेती है।" },
    ],
    criteria: [
      { en: "SC/ST or woman entrepreneur", hi: "एससी/एसटी या महिला उद्यमी", weight: 5, hard: true, test: (p) => (p.category === "SC" || p.category === "ST" || p.gender === "female" ? "yes" : "no") },
      { en: "Greenfield (first-time) enterprise", hi: "ग्रीनफ़ील्ड (पहली बार) उद्यम", weight: 4, hard: true, test: (p) => (p.stage === "expansion" ? "no" : "yes") },
      { en: "Loan requirement of ₹10 lakh or more", hi: "₹10 लाख या अधिक की ऋण आवश्यकता", weight: 4, test: (p) => (p.funding >= 1000000 ? "yes" : "no") },
      { en: "Manufacturing, services, trading or allied agri", hi: "विनिर्माण, सेवा, व्यापार या कृषि-सहबद्ध", weight: 2, test: () => "yes" },
      { en: "Comfortable with a term loan", hi: "सावधि ऋण के लिए तैयार", weight: 2, test: (p) => (p.preference === "grant" ? "partial" : "yes") },
    ],
    plainEn:
      "A bank loan of at least ₹10 lakh reserved for SC, ST and women founders starting something new. 'Composite' means it covers both machines and running costs. The 18-month moratorium means you pay nothing for the first year and a half.",
    plainHi:
      "एससी, एसटी और महिला उद्यमियों के नए उद्यम हेतु कम से कम ₹10 लाख का बैंक ऋण। 'समग्र' का अर्थ है मशीन और चलाने का खर्च दोनों शामिल। 18 माह की मोहलत में डेढ़ वर्ष तक कुछ नहीं चुकाना होता।",
  },
  {
    id: "mudra",
    name: "PM Mudra Loan (Shishu / Kishor / Tarun)",
    nameHi: "पीएम मुद्रा ऋण (शिशु / किशोर / तरुण)",
    ministry: "MUDRA Ltd. · Dept. of Financial Services",
    ministryHi: "मुद्रा लिमिटेड · वित्तीय सेवाएँ विभाग",
    type: "loan",
    tagline: "Collateral-free loans up to ₹20 lakh for non-farm micro-enterprises.",
    taglineHi: "गैर-कृषि सूक्ष्म उद्यमों हेतु ₹20 लाख तक बिना गारंटी ऋण।",
    ceiling: 2000000,
    benefits: [
      { en: "Shishu ≤ ₹50k, Kishor ≤ ₹5L, Tarun ≤ ₹20L", hi: "शिशु ≤ ₹50 हज़ार, किशोर ≤ ₹5 लाख, तरुण ≤ ₹20 लाख" },
      { en: "No collateral, no processing fee for Shishu", hi: "कोई गारंटी नहीं, शिशु में कोई प्रोसेसिंग शुल्क नहीं" },
      { en: "MUDRA RuPay card for working capital", hi: "कार्यशील पूंजी हेतु मुद्रा रुपे कार्ड" },
    ],
    subsidy: (p) => {
      const loan = clamp(p.funding, 2000000);
      const tier = loan <= 50000 ? "Shishu" : loan <= 500000 ? "Kishor" : "Tarun";
      const tierHi = loan <= 50000 ? "शिशु" : loan <= 500000 ? "किशोर" : "तरुण";
      return {
        amount: loan,
        en: `${tier} tranche — collateral-free credit line`,
        hi: `${tierHi} श्रेणी — बिना गारंटी ऋण सीमा`,
      };
    },
    documents: [
      { en: "Aadhaar, PAN, address proof", hi: "आधार, पैन, पते का प्रमाण" },
      { en: "Business proof / Udyam registration", hi: "व्यवसाय प्रमाण / उद्यम पंजीकरण" },
      { en: "6 months bank statement", hi: "6 माह का बैंक विवरण" },
      { en: "Quotations for machinery or stock", hi: "मशीनरी या स्टॉक के कोटेशन" },
    ],
    roadmap: [
      { en: "Pick your tranche", hi: "अपनी श्रेणी चुनें", detailEn: "Shishu, Kishor or Tarun by loan size.", detailHi: "ऋण राशि के अनुसार शिशु, किशोर या तरुण।" },
      { en: "Apply via Jan Samarth or your bank", hi: "जन समर्थ या अपने बैंक से आवेदन", detailEn: "Single digital form across 20+ lenders.", detailHi: "20+ ऋणदाताओं हेतु एक ही डिजिटल फ़ॉर्म।" },
      { en: "Submit KYC and business proof", hi: "केवाईसी और व्यवसाय प्रमाण जमा करें", detailEn: "Shishu needs minimal paperwork.", detailHi: "शिशु में न्यूनतम कागज़ी कार्रवाई।" },
      { en: "Sanction & RuPay card issue", hi: "स्वीकृति और रुपे कार्ड जारी", detailEn: "Draw working capital as needed.", detailHi: "आवश्यकतानुसार कार्यशील पूंजी निकालें।" },
    ],
    criteria: [
      { en: "Non-farm income-generating micro activity", hi: "गैर-कृषि आय-सृजन सूक्ष्म गतिविधि", weight: 4, hard: true, test: (p) => (p.sector === "agri" ? "partial" : "yes") },
      { en: "Requirement within ₹20 lakh", hi: "आवश्यकता ₹20 लाख के भीतर", weight: 4, hard: true, test: (p) => (p.funding <= 2000000 ? "yes" : "no") },
      { en: "Any stage — idea to expansion", hi: "कोई भी अवस्था — विचार से विस्तार तक", weight: 2, test: () => "yes" },
      { en: "Turnover consistent with micro-enterprise", hi: "कारोबार सूक्ष्म उद्यम के अनुरूप", weight: 2, test: (p) => (p.turnover <= 5000000 ? "yes" : "partial") },
      { en: "Loan preference", hi: "ऋण प्राथमिकता", weight: 2, test: (p) => (p.preference === "grant" ? "partial" : "yes") },
    ],
    plainEn:
      "Mudra is the general-purpose small business loan. Three sizes: Shishu (up to ₹50,000), Kishor (up to ₹5 lakh), Tarun (up to ₹20 lakh). No property or gold has to be pledged.",
    plainHi:
      "मुद्रा सामान्य छोटा व्यवसाय ऋण है। तीन आकार: शिशु (₹50,000 तक), किशोर (₹5 लाख तक), तरुण (₹20 लाख तक)। कोई संपत्ति या सोना गिरवी नहीं रखना पड़ता।",
  },
  {
    id: "cgtmse",
    name: "CGTMSE Credit Guarantee",
    nameHi: "सीजीटीएमएसई ऋण गारंटी",
    ministry: "Ministry of MSME · SIDBI Trust",
    ministryHi: "एमएसएमई मंत्रालय · सिडबी ट्रस्ट",
    type: "credit-guarantee",
    tagline: "Government guarantee that replaces collateral on MSME loans up to ₹5 crore.",
    taglineHi: "₹5 करोड़ तक के एमएसएमई ऋण पर गारंटी-संपत्ति की जगह सरकारी गारंटी।",
    ceiling: 50000000,
    benefits: [
      { en: "Up to 85% guarantee cover for micro & women-led units", hi: "सूक्ष्म एवं महिला-नेतृत्व इकाइयों हेतु 85% तक गारंटी कवर" },
      { en: "No third-party guarantee or property mortgage", hi: "कोई तृतीय-पक्ष गारंटी या संपत्ति बंधक नहीं" },
      { en: "Works on top of Mudra, Stand-Up India and bank term loans", hi: "मुद्रा, स्टैंड-अप इंडिया और बैंक ऋण के साथ लागू" },
    ],
    subsidy: (p) => {
      const loan = clamp(p.funding, 50000000);
      const cover = p.gender === "female" || p.category === "SC" || p.category === "ST" || p.pwd ? 0.85 : 0.75;
      return {
        amount: Math.round(loan * cover),
        en: `${Math.round(cover * 100)}% of your loan guaranteed by the trust instead of collateral`,
        hi: `आपके ऋण का ${Math.round(cover * 100)}% ट्रस्ट द्वारा गारंटीकृत, गिरवी की आवश्यकता नहीं`,
      };
    },
    documents: [
      { en: "Udyam registration certificate", hi: "उद्यम पंजीकरण प्रमाणपत्र" },
      { en: "Bank sanction letter of the underlying loan", hi: "मूल ऋण का बैंक स्वीकृति पत्र" },
      { en: "Financial statements / projections", hi: "वित्तीय विवरण / अनुमान" },
      { en: "KYC of promoters", hi: "प्रवर्तकों की केवाईसी" },
    ],
    roadmap: [
      { en: "Get Udyam registered", hi: "उद्यम पंजीकरण कराएँ", detailEn: "Free online MSME registration.", detailHi: "निःशुल्क ऑनलाइन एमएसएमई पंजीकरण।" },
      { en: "Apply for the base loan", hi: "मूल ऋण हेतु आवेदन", detailEn: "Mudra, Stand-Up India or a bank term loan.", detailHi: "मुद्रा, स्टैंड-अप इंडिया या बैंक सावधि ऋण।" },
      { en: "Ask the branch to route it under CGTMSE", hi: "शाखा से सीजीटीएमएसई के तहत भेजने को कहें", detailEn: "The lender files the guarantee application, not you.", detailHi: "गारंटी आवेदन ऋणदाता करता है, आप नहीं।" },
      { en: "Pay the annual guarantee fee", hi: "वार्षिक गारंटी शुल्क भरें", detailEn: "0.37%–1.35% of the guaranteed amount.", detailHi: "गारंटी राशि का 0.37%–1.35%।" },
    ],
    criteria: [
      { en: "Registered or registrable MSME", hi: "पंजीकृत या पंजीकरण-योग्य एमएसएमई", weight: 3, test: (p) => (p.stage === "idea" ? "partial" : "yes") },
      { en: "Loan facility within ₹5 crore", hi: "ऋण सुविधा ₹5 करोड़ के भीतर", weight: 3, hard: true, test: (p) => (p.funding <= 50000000 ? "yes" : "no") },
      { en: "Borrower lacks collateral", hi: "उधारकर्ता के पास गिरवी संपत्ति नहीं", weight: 3, test: () => "yes" },
      { en: "Higher 85% cover for women / SC / ST / PwD", hi: "महिला / एससी / एसटी / दिव्यांग हेतु 85% कवर", weight: 3, test: (p) => (p.gender === "female" || p.category === "SC" || p.category === "ST" || p.pwd ? "yes" : "partial") },
      { en: "Credit-based instrument", hi: "ऋण-आधारित साधन", weight: 2, test: (p) => (p.preference === "grant" ? "partial" : "yes") },
    ],
    plainEn:
      "CGTMSE is not money in your hand — it is the government standing as your guarantor. Banks usually ask for land or gold as security; here the trust promises to cover up to 85% of the loan if things go wrong, so the bank can lend without collateral.",
    plainHi:
      "सीजीटीएमएसई नकद सहायता नहीं, बल्कि सरकार की गारंटी है। बैंक आमतौर पर ज़मीन या सोना गिरवी माँगते हैं; यहाँ ट्रस्ट 85% तक की भरपाई का वादा करता है, जिससे बैंक बिना गिरवी ऋण दे सके।",
  },
  {
    id: "scsthub",
    name: "National SC/ST Hub",
    nameHi: "राष्ट्रीय एससी/एसटी हब",
    ministry: "Ministry of MSME · NSIC",
    ministryHi: "एमएसएमई मंत्रालय · एनएसआईसी",
    type: "grant",
    tagline: "Capacity building, procurement access and subsidy reimbursements for SC/ST MSMEs.",
    taglineHi: "एससी/एसटी एमएसएमई हेतु क्षमता निर्माण, खरीद पहुँच और सब्सिडी प्रतिपूर्ति।",
    ceiling: 1500000,
    benefits: [
      { en: "4% of CPSE procurement reserved for SC/ST MSEs", hi: "सीपीएसई खरीद का 4% एससी/एसटी एमएसई हेतु आरक्षित" },
      { en: "Reimbursement of Udyam, GeM, testing & certification costs", hi: "उद्यम, जीईएम, परीक्षण एवं प्रमाणन लागत की प्रतिपूर्ति" },
      { en: "Subsidy on ERP, bank guarantee fee and trade fair participation", hi: "ईआरपी, बैंक गारंटी शुल्क और व्यापार मेला भागीदारी पर सब्सिडी" },
    ],
    subsidy: () => ({
      amount: 300000,
      en: "Bundle of reimbursements + reserved public procurement access",
      hi: "प्रतिपूर्ति पैकेज + आरक्षित सार्वजनिक खरीद पहुँच",
    }),
    documents: [
      { en: "Caste certificate (SC/ST)", hi: "जाति प्रमाणपत्र (एससी/एसटी)" },
      { en: "Udyam registration", hi: "उद्यम पंजीकरण" },
      { en: "GeM seller profile", hi: "जीईएम विक्रेता प्रोफ़ाइल" },
      { en: "Invoices for the costs being reimbursed", hi: "प्रतिपूर्ति हेतु लागत के बिल" },
    ],
    roadmap: [
      { en: "Register on the NSSH portal", hi: "एनएसएसएच पोर्टल पर पंजीकरण", detailEn: "scsthub.in with Udyam number.", detailHi: "उद्यम संख्या सहित scsthub.in पर।" },
      { en: "Attend a capacity-building programme", hi: "क्षमता निर्माण कार्यक्रम में भाग लें", detailEn: "Free NSIC/MSME-DI workshops.", detailHi: "निःशुल्क एनएसआईसी/एमएसएमई-डीआई कार्यशालाएँ।" },
      { en: "List products on GeM", hi: "जीईएम पर उत्पाद सूचीबद्ध करें", detailEn: "Access the 4% reserved procurement quota.", detailHi: "4% आरक्षित खरीद कोटा प्राप्त करें।" },
      { en: "Claim reimbursements", hi: "प्रतिपूर्ति का दावा करें", detailEn: "Upload invoices under the relevant sub-scheme.", detailHi: "संबंधित उप-योजना में बिल अपलोड करें।" },
    ],
    criteria: [
      { en: "SC or ST promoter holding 51%+ ownership", hi: "51%+ स्वामित्व वाला एससी या एसटी प्रवर्तक", weight: 6, hard: true, test: (p) => (p.category === "SC" || p.category === "ST" ? "yes" : "no") },
      { en: "Udyam-registered enterprise", hi: "उद्यम-पंजीकृत उद्यम", weight: 3, test: (p) => (p.stage === "idea" ? "partial" : "yes") },
      { en: "Products/services sellable to public buyers", hi: "सार्वजनिक क्रेताओं को बेचने योग्य उत्पाद/सेवा", weight: 2, test: (p) => (p.sector === "street-vendor" ? "partial" : "yes") },
      { en: "Grant/reimbursement oriented", hi: "अनुदान/प्रतिपूर्ति आधारित", weight: 2, test: (p) => (p.preference === "loan" ? "partial" : "yes") },
    ],
    plainEn:
      "The SC/ST Hub does not lend you money. It reserves 4% of everything government companies buy for SC/ST owned firms, and refunds you for costs like certification, GeM listing and trade fairs.",
    plainHi:
      "एससी/एसटी हब ऋण नहीं देता। यह सरकारी कंपनियों की खरीद का 4% एससी/एसटी स्वामित्व वाली फर्मों हेतु आरक्षित करता है और प्रमाणन, जीईएम सूचीकरण, व्यापार मेला जैसी लागतों की भरपाई करता है।",
  },
  {
    id: "nhfdc",
    name: "NHFDC Divyangjan Swavalamban",
    nameHi: "एनएचएफडीसी दिव्यांगजन स्वावलंबन",
    ministry: "Dept. of Empowerment of Persons with Disabilities",
    ministryHi: "दिव्यांगजन सशक्तिकरण विभाग",
    type: "loan",
    tagline: "Concessional self-employment loans for persons with 40%+ disability.",
    taglineHi: "40%+ दिव्यांगता वाले व्यक्तियों हेतु रियायती स्वरोजगार ऋण।",
    ceiling: 5000000,
    benefits: [
      { en: "Interest from 5% p.a., 1% rebate for women", hi: "5% वार्षिक से ब्याज, महिलाओं को 1% छूट" },
      { en: "Up to ₹50 lakh for self-employment ventures", hi: "स्वरोजगार उद्यम हेतु ₹50 लाख तक" },
      { en: "Skill training and assistive-device support", hi: "कौशल प्रशिक्षण और सहायक उपकरण सहायता" },
    ],
    subsidy: (p) => {
      const loan = clamp(p.funding, 5000000);
      return {
        amount: Math.round(loan * 0.05 * 3),
        en: "Interest saved over 3 years vs. a commercial loan",
        hi: "वाणिज्यिक ऋण की तुलना में 3 वर्ष की ब्याज बचत",
      };
    },
    documents: [
      { en: "UDID / disability certificate (40%+)", hi: "यूडीआईडी / दिव्यांगता प्रमाणपत्र (40%+)" },
      { en: "Income certificate", hi: "आय प्रमाणपत्र" },
      { en: "Project proposal", hi: "परियोजना प्रस्ताव" },
      { en: "Aadhaar & bank details", hi: "आधार और बैंक विवरण" },
    ],
    roadmap: [
      { en: "Obtain / verify UDID card", hi: "यूडीआईडी कार्ड बनवाएँ या सत्यापित कराएँ", detailEn: "Needed for every disability-linked benefit.", detailHi: "हर दिव्यांगता-संबंधी लाभ हेतु आवश्यक।" },
      { en: "Apply through the State Channelising Agency", hi: "राज्य चैनलाइज़िंग एजेंसी से आवेदन", detailEn: "Or via a partner bank / NBFC.", detailHi: "या साझेदार बैंक / एनबीएफसी के माध्यम से।" },
      { en: "Project appraisal", hi: "परियोजना मूल्यांकन", detailEn: "Viability check on the proposed venture.", detailHi: "प्रस्तावित उद्यम की व्यवहार्यता जाँच।" },
      { en: "Disbursal with concessional interest", hi: "रियायती ब्याज पर वितरण", detailEn: "Repayment up to 10 years.", detailHi: "10 वर्ष तक चुकौती।" },
    ],
    criteria: [
      { en: "Person with 40% or more disability", hi: "40% या अधिक दिव्यांगता वाला व्यक्ति", weight: 6, hard: true, test: (p) => (p.pwd ? "yes" : "no") },
      { en: "Age 18 or above", hi: "आयु 18 वर्ष या अधिक", weight: 2, hard: true, test: (p) => (p.age >= 18 ? "yes" : "no") },
      { en: "Self-employment / enterprise purpose", hi: "स्वरोजगार / उद्यम उद्देश्य", weight: 3, test: () => "yes" },
      { en: "Loan need within ₹50 lakh", hi: "ऋण आवश्यकता ₹50 लाख के भीतर", weight: 2, test: (p) => (p.funding <= 5000000 ? "yes" : "partial") },
      { en: "Women applicants get an extra 1% rebate", hi: "महिला आवेदकों को 1% अतिरिक्त छूट", weight: 1, test: (p) => (p.gender === "female" ? "yes" : "partial") },
    ],
    plainEn:
      "NHFDC lends to differently-abled entrepreneurs at about 5% a year — roughly half of a normal business loan rate — and adds skill training on top. You need a UDID card showing 40% or more disability.",
    plainHi:
      "एनएचएफडीसी दिव्यांग उद्यमियों को लगभग 5% वार्षिक ब्याज पर ऋण देता है — सामान्य व्यवसाय ऋण से लगभग आधा — साथ में कौशल प्रशिक्षण भी। इसके लिए 40%+ दिव्यांगता दर्शाने वाला यूडीआईडी कार्ड चाहिए।",
  },
  {
    id: "agri-infra",
    name: "Agriculture Infrastructure Fund",
    nameHi: "कृषि अवसंरचना निधि",
    ministry: "Ministry of Agriculture & Farmers' Welfare",
    ministryHi: "कृषि एवं किसान कल्याण मंत्रालय",
    type: "subsidy",
    tagline: "3% interest subvention on loans for post-harvest and agri-processing assets.",
    taglineHi: "फसलोत्तर एवं कृषि-प्रसंस्करण परिसंपत्तियों हेतु ऋण पर 3% ब्याज सहायता।",
    ceiling: 20000000,
    benefits: [
      { en: "3% interest subvention for 7 years", hi: "7 वर्ष तक 3% ब्याज सहायता" },
      { en: "Credit guarantee cover up to ₹2 crore", hi: "₹2 करोड़ तक क्रेडिट गारंटी कवर" },
      { en: "Stackable with other central/state subsidies", hi: "अन्य केंद्रीय/राज्य सब्सिडी के साथ संयोजनीय" },
    ],
    subsidy: (p) => {
      const loan = clamp(p.funding, 20000000);
      return {
        amount: Math.round(loan * 0.03 * 7),
        en: "3% interest subvention accumulated over the 7-year term",
        hi: "7 वर्ष की अवधि में संचित 3% ब्याज सहायता",
      };
    },
    documents: [
      { en: "Land / lease records for the facility", hi: "सुविधा हेतु भूमि / पट्टा अभिलेख" },
      { en: "Detailed project report", hi: "विस्तृत परियोजना रिपोर्ट" },
      { en: "Udyam or FPO registration", hi: "उद्यम या एफपीओ पंजीकरण" },
      { en: "Bank sanction / in-principle letter", hi: "बैंक स्वीकृति / सैद्धांतिक पत्र" },
    ],
    roadmap: [
      { en: "Register on agriinfra.dac.gov.in", hi: "agriinfra.dac.gov.in पर पंजीकरण", detailEn: "Choose the asset category — storage, grading, cold chain.", detailHi: "परिसंपत्ति श्रेणी चुनें — भंडारण, ग्रेडिंग, कोल्ड चेन।" },
      { en: "Submit DPR to a lending bank", hi: "ऋणदाता बैंक को डीपीआर दें", detailEn: "The portal routes it to your chosen lender.", detailHi: "पोर्टल इसे आपके चुने ऋणदाता को भेजता है।" },
      { en: "Sanction and subvention tagging", hi: "स्वीकृति और सहायता टैगिंग", detailEn: "Bank tags the loan for 3% subvention.", detailHi: "बैंक ऋण को 3% सहायता हेतु टैग करता है।" },
      { en: "Build the asset, claim annually", hi: "परिसंपत्ति बनाएँ, वार्षिक दावा करें", detailEn: "Subvention credited each year for 7 years.", detailHi: "7 वर्ष तक प्रतिवर्ष सहायता जमा।" },
    ],
    criteria: [
      { en: "Agriculture / allied post-harvest activity", hi: "कृषि / सहबद्ध फसलोत्तर गतिविधि", weight: 6, hard: true, test: (p) => (p.sector === "agri" ? "yes" : "no") },
      { en: "Community farming or processing asset created", hi: "सामुदायिक कृषि या प्रसंस्करण परिसंपत्ति निर्मित", weight: 3, test: (p) => (p.stage === "idea" ? "partial" : "yes") },
      { en: "Loan within ₹2 crore for full subvention", hi: "पूर्ण सहायता हेतु ₹2 करोड़ तक ऋण", weight: 2, test: (p) => (p.funding <= 20000000 ? "yes" : "partial") },
      { en: "Rural / peri-urban location", hi: "ग्रामीण / उप-शहरी स्थान", weight: 2, test: (p) => (p.area === "rural" ? "yes" : "partial") },
    ],
    plainEn:
      "If you are building something that stores or processes farm produce — a cold room, a grading unit, a warehouse — the government pays 3% of your loan interest every year for seven years.",
    plainHi:
      "यदि आप कृषि उपज के भंडारण या प्रसंस्करण हेतु कुछ बना रहे हैं — कोल्ड रूम, ग्रेडिंग इकाई, गोदाम — तो सरकार सात वर्ष तक हर साल आपके ऋण ब्याज का 3% चुकाती है।",
  },
];

export type Persona = {
  id: string;
  emoji: string;
  name: string;
  nameHi: string;
  headline: string;
  headlineHi: string;
  tags: { en: string; hi: string }[];
  profile: Profile;
};

export const PERSONAS: Persona[] = [
  {
    id: "sunita",
    emoji: "🧵",
    name: "Sunita Devi",
    nameHi: "सुनीता देवी",
    headline: "Rural handloom artisan · SC woman",
    headlineHi: "ग्रामीण हथकरघा कारीगर · एससी महिला",
    tags: [
      { en: "Barabanki, UP", hi: "बाराबंकी, उ.प्र." },
      { en: "Needs ₹2.5L for looms", hi: "करघों हेतु ₹2.5 लाख" },
      { en: "Prefers subsidy", hi: "सब्सिडी पसंद" },
    ],
    profile: {
      name: "Sunita Devi",
      category: "SC",
      gender: "female",
      pwd: false,
      stage: "existing",
      state: "Uttar Pradesh",
      area: "rural",
      sector: "artisan",
      turnover: 180000,
      funding: 250000,
      preference: "grant",
      age: 34,
    },
  },
  {
    id: "ramesh",
    emoji: "🍲",
    name: "Ramesh Yadav",
    nameHi: "रमेश यादव",
    headline: "Street food vendor · OBC",
    headlineHi: "स्ट्रीट फूड विक्रेता · ओबीसी",
    tags: [
      { en: "Kanpur, UP", hi: "कानपुर, उ.प्र." },
      { en: "Needs ₹40,000 working capital", hi: "₹40,000 कार्यशील पूंजी" },
      { en: "No collateral", hi: "कोई गिरवी नहीं" },
    ],
    profile: {
      name: "Ramesh Yadav",
      category: "OBC",
      gender: "male",
      pwd: false,
      stage: "existing",
      state: "Uttar Pradesh",
      area: "urban",
      sector: "street-vendor",
      turnover: 420000,
      funding: 40000,
      preference: "loan",
      age: 41,
    },
  },
  {
    id: "priya",
    emoji: "💻",
    name: "Priya Sharma",
    nameHi: "प्रिया शर्मा",
    headline: "Tech / services woman founder",
    headlineHi: "टेक / सेवा क्षेत्र महिला संस्थापक",
    tags: [
      { en: "Bengaluru, Karnataka", hi: "बेंगलुरु, कर्नाटक" },
      { en: "Needs ₹15L to scale", hi: "विस्तार हेतु ₹15 लाख" },
      { en: "First-time founder", hi: "पहली बार उद्यमी" },
    ],
    profile: {
      name: "Priya Sharma",
      category: "General",
      gender: "female",
      pwd: false,
      stage: "new",
      state: "Karnataka",
      area: "urban",
      sector: "service",
      turnover: 900000,
      funding: 1500000,
      preference: "any",
      age: 29,
    },
  },
  {
    id: "arjun",
    emoji: "🌾",
    name: "Arjun Meena",
    nameHi: "अर्जुन मीणा",
    headline: "Differently-abled agri-enterpriser",
    headlineHi: "दिव्यांग कृषि-उद्यमी",
    tags: [
      { en: "Kota, Rajasthan", hi: "कोटा, राजस्थान" },
      { en: "Cold storage unit ₹18L", hi: "कोल्ड स्टोरेज इकाई ₹18 लाख" },
      { en: "UDID 60% disability", hi: "यूडीआईडी 60% दिव्यांगता" },
    ],
    profile: {
      name: "Arjun Meena",
      category: "ST",
      gender: "male",
      pwd: true,
      stage: "new",
      state: "Rajasthan",
      area: "rural",
      sector: "agri",
      turnover: 650000,
      funding: 1800000,
      preference: "any",
      age: 37,
    },
  },
];

export const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];
