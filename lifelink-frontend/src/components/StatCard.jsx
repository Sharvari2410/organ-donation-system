function StatCard({ label, value, tone = "primary" }) {
  const colorClasses =
    tone === "mint"
      ? "from-mint-50 to-white text-mint-700 ring-mint-200"
      : "from-primary-50 to-white text-primary-700 ring-primary-200";

  return (
    <article
      className={`rounded-2xl bg-gradient-to-br ${colorClasses} p-5 shadow-soft ring-1 transition hover:-translate-y-0.5`}
    >
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </article>
  );
}

export default StatCard;
