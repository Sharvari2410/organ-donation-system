import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import InputField from "../components/InputField";
import PageHeader from "../components/PageHeader";
import { BLOOD_GROUP_OPTIONS, ORGAN_OPTIONS } from "../constants/formOptions";
import { useNotifications } from "../contexts/NotificationContext";
import { createDonor, getDonorAppointmentsByContact } from "../services/api";

const initialState = {
  name: "",
  age: "",
  bloodGroup: "",
  organ: "",
  location: "",
  phone: "",
  email: "",
};

function validateDonor(form) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.age || Number(form.age) < 18) errors.age = "Age must be at least 18.";
  if (!form.bloodGroup) errors.bloodGroup = "Select blood group.";
  if (!form.organ) errors.organ = "Select organ.";
  if (!form.location.trim()) errors.location = "Location is required.";
  if (!form.phone.trim()) errors.phone = "Phone is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  return errors;
}

function DonorPage() {
  const { addNotification } = useNotifications();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const storedDonorContact = JSON.parse(localStorage.getItem("lifelinkDonorContact") || "{}");
  const [lookupEmail, setLookupEmail] = useState(storedDonorContact.email || "");
  const [lookupPhone, setLookupPhone] = useState(storedDonorContact.phone || "");
  const [appointments, setAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  const canSubmit = useMemo(() => Object.keys(validateDonor(form)).length === 0, [form]);

  async function handleSubmit(event) {
    event.preventDefault();
    const fieldErrors = validateDonor(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await createDonor({
        name: form.name.trim(),
        age: Number(form.age),
        bloodGroup: form.bloodGroup,
        organ: form.organ,
        location: form.location.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      });
      setForm(initialState);
      localStorage.setItem(
        "lifelinkDonorContact",
        JSON.stringify({ email: form.email.trim(), phone: form.phone.trim() })
      );
      setLookupEmail(form.email.trim());
      setLookupPhone(form.phone.trim());
      setMessage({ type: "success", text: "Donor registered successfully." });
      addNotification("Donor profile updated successfully.", "success");
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Could not register donor." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function fetchAppointments() {
    if (!lookupEmail.trim() && !lookupPhone.trim()) {
      addNotification("Enter email or phone to view donor appointments.");
      return;
    }
    setIsLoadingAppointments(true);
    try {
      const response = await getDonorAppointmentsByContact({ email: lookupEmail, phone: lookupPhone });
      setAppointments(Array.isArray(response.appointments) ? response.appointments : []);
      localStorage.setItem(
        "lifelinkDonorContact",
        JSON.stringify({ email: lookupEmail.trim(), phone: lookupPhone.trim() })
      );
      if ((response.appointments || []).length > 0) {
        addNotification(`Appointment update: ${response.appointments.length} scheduled case(s).`, "success");
      }
    } catch (error) {
      setAppointments([]);
      addNotification(error.message || "Could not fetch donor appointments.");
    } finally {
      setIsLoadingAppointments(false);
    }
  }

  const inputClassName =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100";

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Donor Intake"
        title="Register As Donor"
        description="Provide accurate donor details so potential matches can be identified quickly and safely."
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
              min="18"
              placeholder="18+"
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

          <InputField label="Organ" id="organ" error={errors.organ}>
            <select
              id="organ"
              className={inputClassName}
              value={form.organ}
              onChange={(event) => updateField("organ", event.target.value)}
            >
              <option value="">Select</option>
              {ORGAN_OPTIONS.map((organ) => (
                <option key={organ} value={organ}>
                  {organ}
                </option>
              ))}
            </select>
          </InputField>

          <InputField label="Location" id="location" error={errors.location}>
            <input
              id="location"
              type="text"
              placeholder="City / State"
              className={inputClassName}
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
            />
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
            "Submit Donor Details"
          )}
        </button>

        {message.text ? (
          <p
            className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${
              message.type === "success" ? "bg-mint-50 text-mint-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 size={16} /> : null}
            {message.text}
          </p>
        ) : null}
      </form>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <h3 className="text-lg font-extrabold text-slate-900">My Appointment Schedule</h3>
        <p className="mt-1 text-sm text-slate-600">Use your donor contact details to view approved appointments.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            type="email"
            value={lookupEmail}
            onChange={(event) => setLookupEmail(event.target.value)}
            placeholder="Registered email"
            className={inputClassName}
          />
          <input
            type="tel"
            value={lookupPhone}
            onChange={(event) => setLookupPhone(event.target.value)}
            placeholder="Registered phone"
            className={inputClassName}
          />
          <button
            type="button"
            onClick={fetchAppointments}
            className="rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-700"
          >
            {isLoadingAppointments ? "Checking..." : "Check Appointments"}
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {appointments.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">No scheduled appointments yet.</p>
          ) : (
            appointments.map((item) => (
              <article key={item._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">
                  Recipient: {item.recipientSnapshot?.name || "N/A"} ({item.recipientSnapshot?.bloodGroup || "N/A"} -{" "}
                  {item.recipientSnapshot?.requiredOrgan || "N/A"})
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Scheduled for: {item.appointmentAt ? new Date(item.appointmentAt).toLocaleString() : "Not set"}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Contact: {item.recipientSnapshot?.phone || "No phone"} | {item.recipientSnapshot?.email || "No email"}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default DonorPage;
