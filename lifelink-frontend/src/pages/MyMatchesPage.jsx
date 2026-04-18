import { LoaderCircle, Search, Users } from "lucide-react";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useNotifications } from "../contexts/NotificationContext";
import { getRecipientAppointmentsByContact, getRecipientMatchesByContact } from "../services/api";

function MyMatchesPage() {
  const { addNotification } = useNotifications();
  const storedContact = JSON.parse(localStorage.getItem("lifelinkRecipientContact") || "{}");
  const [email, setEmail] = useState(storedContact.email || "");
  const [phone, setPhone] = useState(storedContact.phone || "");
  const [recipient, setRecipient] = useState(null);
  const [matches, setMatches] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchMatchesByContact() {
    if (!email.trim() && !phone.trim()) {
      setError("Enter your registered email or phone.");
      setMatches([]);
      setRecipient(null);
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const [matchesResponse, appointmentsResponse] = await Promise.all([
        getRecipientMatchesByContact({ email, phone }),
        getRecipientAppointmentsByContact({ email, phone }),
      ]);

      setRecipient(matchesResponse.recipient || appointmentsResponse.recipient || null);
      setMatches(Array.isArray(matchesResponse.matches) ? matchesResponse.matches : []);
      setAppointments(Array.isArray(appointmentsResponse.appointments) ? appointmentsResponse.appointments : []);

      if ((matchesResponse.matches || []).length > 0) {
        addNotification(`New match found: ${matchesResponse.matches.length} donor(s) available.`, "success");
      }
      if ((appointmentsResponse.appointments || []).length > 0) {
        addNotification(`Appointment update: ${appointmentsResponse.appointments.length} scheduled case(s).`, "success");
      }
      localStorage.setItem(
        "lifelinkRecipientContact",
        JSON.stringify({ email: email.trim(), phone: phone.trim() })
      );
    } catch (requestError) {
      setError(requestError.message || "Could not load matches.");
      setMatches([]);
      setAppointments([]);
      setRecipient(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Recipient View"
        title="My Matches"
        description="See donors that match your required organ and blood group, along with contact details."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
          />
          <input
            type="tel"
            placeholder="Or enter phone number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
          />
          <button
            type="button"
            onClick={fetchMatchesByContact}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-700"
          >
            {isLoading ? <LoaderCircle size={16} className="animate-spin" /> : <Search size={16} />}
            Check Matches
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Use the same email or phone that you entered during recipient registration.
        </p>
      </section>

      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}

      {recipient ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-extrabold text-slate-900">Recipient Summary</h3>
          <p className="mt-2 text-sm text-slate-700">
            <span className="font-bold">{recipient.name}</span> - {recipient.bloodGroup} - {recipient.requiredOrgan}
          </p>
          <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${urgencyTone(recipient.urgency)}`}>
            Urgency: {recipient.urgency}
          </span>
        </section>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="mb-4 text-lg font-extrabold text-slate-900">Matched Donors</h3>
        {isLoading ? (
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <LoaderCircle size={16} className="animate-spin" />
            Loading matches...
          </div>
        ) : matches.length === 0 ? (
          <EmptyState text="No donor matches found for this recipient yet." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {matches.map((match, index) => (
              <article
                key={`${match.donor?._id || "donor"}-${index}`}
                className="rounded-2xl border border-mint-200 bg-gradient-to-r from-mint-50 to-white p-4"
              >
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-mint-700">Matched Donor</p>
                <p className="mt-2 text-base font-bold text-slate-900">{match.donor?.name || "N/A"}</p>
                <p className="mt-1 text-sm text-slate-700">
                  {match.donor?.bloodGroup || "N/A"} - {match.donor?.organ || "N/A"}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
                  {match.donor?.location || "Location not available"}
                </p>

                <div className="mt-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Contact</p>
                  <p className="mt-1 text-sm text-slate-700">Phone: {match.donor?.phone || "Not provided"}</p>
                  <p className="text-sm text-slate-700">Email: {match.donor?.email || "Not provided"}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="mb-4 text-lg font-extrabold text-slate-900">Appointment Schedule</h3>
        {isLoading ? (
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <LoaderCircle size={16} className="animate-spin" />
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <EmptyState text="No scheduled appointments yet." />
        ) : (
          <div className="space-y-3">
            {appointments.map((item) => (
              <article key={item._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">
                  Donor: {item.donorSnapshot?.name || "N/A"} ({item.donorSnapshot?.bloodGroup || "N/A"} -{" "}
                  {item.donorSnapshot?.organ || "N/A"})
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Scheduled for: {item.appointmentAt ? new Date(item.appointmentAt).toLocaleString() : "Not set"}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Contact: {item.donorSnapshot?.phone || "No phone"} | {item.donorSnapshot?.email || "No email"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function urgencyTone(urgency) {
  if (urgency === "Critical") return "bg-rose-100 text-rose-700";
  if (urgency === "High") return "bg-orange-100 text-orange-700";
  if (urgency === "Medium") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

function EmptyState({ text }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
      <Users size={16} />
      {text}
    </div>
  );
}

export default MyMatchesPage;
