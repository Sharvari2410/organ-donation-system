import { AlertCircle, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import PageHeader from "../components/PageHeader";
import { BLOOD_GROUP_OPTIONS, ORGAN_OPTIONS, URGENCY_OPTIONS } from "../constants/formOptions";
import { useNotifications } from "../contexts/NotificationContext";
import { createRecipient } from "../services/api";

const initialState = {
  name: "",
  age: "",
  bloodGroup: "",
  requiredOrgan: "",
  urgency: "",
  phone: "",
  email: "",
};

function validateRecipient(form) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.age || Number(form.age) < 1) errors.age = "Please enter valid age.";
  if (!form.bloodGroup) errors.bloodGroup = "Select blood group.";
  if (!form.requiredOrgan) errors.requiredOrgan = "Select required organ.";
  if (!form.urgency) errors.urgency = "Select urgency level.";
  if (!form.phone.trim()) errors.phone = "Phone is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  return errors;
}

function RecipientPage() {
  const { addNotification } = useNotifications();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [registeredRecipientId, setRegisteredRecipientId] = useState("");

  const canSubmit = useMemo(() => Object.keys(validateRecipient(form)).length === 0, [form]);

  async function handleSubmit(event) {
    event.preventDefault();
    const fieldErrors = validateRecipient(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const createdRecipient = await createRecipient({
        name: form.name.trim(),
        age: Number(form.age),
        bloodGroup: form.bloodGroup,
        requiredOrgan: form.requiredOrgan,
        urgency: form.urgency,
        phone: form.phone.trim(),
        email: form.email.trim(),
      });
      setForm(initialState);
      setRegisteredRecipientId(createdRecipient?._id || "");
      if (createdRecipient?._id) {
        localStorage.setItem("lifelinkRecipientId", createdRecipient._id);
      }
      localStorage.setItem(
        "lifelinkRecipientContact",
        JSON.stringify({ email: createdRecipient?.email || form.email.trim(), phone: createdRecipient?.phone || form.phone.trim() })
      );
      setMessage({ type: "success", text: "Recipient registered successfully." });
      addNotification("Recipient profile updated successfully.", "success");
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Could not register recipient." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const inputClassName =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100";

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Recipient Intake"
        title="Register Recipient Details"
        description="Capture medical need, organ type, and urgency to improve visibility in the matching dashboard."
      />

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField label="Full Name" id="name" error={errors.name}>
            <input
              id="name"
              type="text"
              placeholder="Enter full name"
              className={inputClassName}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </InputField>

          <InputField label="Age" id="age" error={errors.age}>
            <input
              id="age"
              type="number"
              min="1"
              placeholder="Enter age"
              className={inputClassName}
              value={form.age}
              onChange={(event) => updateField("age", event.target.value)}
            />
          </InputField>

          <InputField label="Blood Group" id="bloodGroup" error={errors.bloodGroup}>
            <select
              id="bloodGroup"
              className={inputClassName}
              value={form.bloodGroup}
              onChange={(event) => updateField("bloodGroup", event.target.value)}
            >
              <option value="">Select</option>
              {BLOOD_GROUP_OPTIONS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </InputField>

          <InputField label="Required Organ" id="requiredOrgan" error={errors.requiredOrgan}>
            <select
              id="requiredOrgan"
              className={inputClassName}
              value={form.requiredOrgan}
              onChange={(event) => updateField("requiredOrgan", event.target.value)}
            >
              <option value="">Select</option>
              {ORGAN_OPTIONS.map((organ) => (
                <option key={organ} value={organ}>
                  {organ}
                </option>
              ))}
            </select>
          </InputField>

          <InputField label="Urgency" id="urgency" error={errors.urgency}>
            <select
              id="urgency"
              className={inputClassName}
              value={form.urgency}
              onChange={(event) => updateField("urgency", event.target.value)}
            >
              <option value="">Select</option>
              {URGENCY_OPTIONS.map((urgency) => (
                <option key={urgency} value={urgency}>
                  {urgency}
                </option>
              ))}
            </select>
          </InputField>

          <InputField label="Phone" id="phone" error={errors.phone}>
            <input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              className={inputClassName}
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </InputField>

          <InputField label="Email" id="email" error={errors.email}>
            <input
              id="email"
              type="email"
              placeholder="Enter email address"
              className={inputClassName}
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </InputField>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-mint-500 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle size={16} className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Recipient Details"
          )}
        </button>

        {message.text ? (
          <p
            className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${
              message.type === "success" ? "bg-mint-50 text-mint-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {message.type === "error" ? <AlertCircle size={16} /> : null}
            {message.text}
          </p>
        ) : null}

        {registeredRecipientId ? (
          <div className="mt-4">
            <Link
              to="/my-matches"
              className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-5 py-2 text-sm font-bold text-primary-700 transition hover:bg-primary-100"
            >
              View My Matches
            </Link>
          </div>
        ) : null}
      </form>
    </div>
  );
}

export default RecipientPage;
