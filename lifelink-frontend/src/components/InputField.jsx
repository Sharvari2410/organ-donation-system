function InputField({ label, id, error, children }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-xs font-semibold text-rose-600">{error}</span> : null}
    </label>
  );
}

export default InputField;
