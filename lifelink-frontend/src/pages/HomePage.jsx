import { ArrowRight, HeartHandshake, ShieldCheck, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const features = [
  {
    title: "Save More Lives",
    description:
      "A single donor can transform multiple families. LifeLink helps connect every donation with urgent need quickly.",
    icon: HeartHandshake,
  },
  {
    title: "Trusted Workflow",
    description:
      "Simple registration, verified records, and clean tracking for donors and recipients in one healthcare dashboard.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Matching",
    description:
      "Blood group and organ-based matching gives hospitals and volunteers a practical shortlist without manual effort.",
    icon: Stethoscope,
  },
];

function HomePage() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-mint-600 px-6 py-14 text-white shadow-soft sm:px-10">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-mint-300/20 blur-2xl" />
        <div className="relative z-10 max-w-3xl animate-fade-up">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-100">
            Healthcare Platform
          </p>
          <h2 className="text-4xl font-black leading-tight sm:text-5xl">
            Help Bridge Donors And Recipients With Confidence
          </h2>
          <p className="mt-5 max-w-2xl text-base text-primary-50 sm:text-lg">
            LifeLink Organ Donation is a modern system for donor registration, recipient intake, and transparent
            matching support.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/donor"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-700 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Register As Donor <ArrowRight size={16} />
            </Link>
            <Link
              to="/recipient"
              className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Find Organ
            </Link>
          </div>
        </div>
      </section>

      <section>
        <PageHeader
          eyebrow="Why Donate"
          title="Your Decision Can Give Someone A Second Chance"
          description="Organ donation can help patients recover, return to families, and rebuild a normal life. Every registration matters."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <PageHeader
          eyebrow="How It Works"
          title="Simple Process, Real Impact"
          description="Built for easy onboarding and clear visibility for admins during college demos and portfolio presentations."
        />
        <ol className="grid gap-4 md:grid-cols-3">
          <li className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600">Step 1</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">Register Donors</h3>
            <p className="mt-2 text-sm text-slate-600">Collect donor details with validated fields and structured data.</p>
          </li>
          <li className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600">Step 2</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">Add Recipients</h3>
            <p className="mt-2 text-sm text-slate-600">Capture urgency and required organ details for better prioritization.</p>
          </li>
          <li className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600">Step 3</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">View Dashboard</h3>
            <p className="mt-2 text-sm text-slate-600">See all records, total counts, and highlight donor-recipient matches.</p>
          </li>
        </ol>
      </section>
    </div>
  );
}

export default HomePage;
