import { bi, useLang } from "@/lib/i18n";

const TEAM = [
  { name: "Divyanshu Panwar", roleEn: "Team Lead · Rule Engine", roleHi: "टीम लीड · नियम इंजन" },
  { name: "Himanshu Sati", roleEn: "Backend · FastAPI & Data Sync", roleHi: "बैकएंड · फास्टएपीआई एवं डेटा सिंक" },
  { name: "Saloni Vaish", roleEn: "Frontend · UX & Accessibility", roleHi: "फ्रंटएंड · यूएक्स एवं सुगम्यता" },
  { name: "Sonakshi Srivastava", roleEn: "AI/NLP · Embeddings & RAG", roleHi: "एआई/एनएलपी · एम्बेडिंग एवं आरएजी" },
  { name: "Atishay Mishra", roleEn: "Scheme Research · Policy Mapping", roleHi: "योजना शोध · नीति मानचित्रण" },
  { name: "Dhiraj Kumar", roleEn: "Product & Pitch · Impact Modelling", roleHi: "उत्पाद एवं पिच · प्रभाव मॉडलिंग" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

export function TeamCredits() {
  const { lang } = useLang();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TEAM.map((m) => (
        <div key={m.name} className="flex items-center gap-4 rounded-xl border bg-card p-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {initials(m.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{m.name}</p>
            <p className="truncate text-xs text-muted-foreground">{bi(lang, m.roleEn, m.roleHi)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
