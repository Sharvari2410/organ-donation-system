function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-8 animate-fade-up">
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-base text-slate-600">{description}</p> : null}
    </div>
  );
}

export default PageHeader;
