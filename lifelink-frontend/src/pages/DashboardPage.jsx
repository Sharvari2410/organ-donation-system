import { CheckCircle2, LoaderCircle, RefreshCcw, Search, Users, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { BLOOD_GROUP_OPTIONS, ORGAN_OPTIONS, URGENCY_OPTIONS } from "../constants/formOptions";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import {
  createMatchRequest,
  getDonors,
  getMatchRequests,
  getRecipients,
  reviewMatchRequest,
  scheduleAppointment,
} from "../services/api";
import { buildMatches } from "../utils/matching";

const defaultFilters = {
  organ: "",
  bloodGroup: "",
  urgency: "",
  city: "",
  ageMin: "",
  ageMax: "",
};

function DashboardPage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [matchRequests, setMatchRequests] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [actionLoadingKey, setActionLoadingKey] = useState("");
  const [error, setError] = useState("");
  const [appointmentDraft, setAppointmentDraft] = useState({});

  const canReview = user?.role === "Admin";

  const fetchDashboardData = useCallback(
    async ({ showLoader = true } = {}) => {
      if (showLoader) setLoading(true);
      setError("");
      try {
        const [donorResult, recipientResult, requestResult] = await Promise.allSettled([
          getDonors({
            organ: filters.organ,
            bloodGroup: filters.bloodGroup,
            city: filters.city,
            ageMin: filters.ageMin,
            ageMax: filters.ageMax,
          }),
          getRecipients({
            requiredOrgan: filters.organ,
            bloodGroup: filters.bloodGroup,
            urgency: filters.urgency,
            ageMin: filters.ageMin,
            ageMax: filters.ageMax,
          }),
          getMatchRequests(),
        ]);
        if (donorResult.status === "fulfilled") {
          setDonors(Array.isArray(donorResult.value) ? donorResult.value : []);
        } else {
          setDonors([]);
          addNotification(donorResult.reason?.message || "Could not fetch donors.");
        }

        if (recipientResult.status === "fulfilled") {
          setRecipients(Array.isArray(recipientResult.value) ? recipientResult.value : []);
        } else {
          setRecipients([]);
          addNotification(recipientResult.reason?.message || "Could not fetch recipients.");
        }

        if (requestResult.status === "fulfilled") {
          setMatchRequests(Array.isArray(requestResult.value?.matchRequests) ? requestResult.value.matchRequests : []);
        } else {
          setMatchRequests([]);
          addNotification(requestResult.reason?.message || "Could not fetch match requests.");
        }
      } catch (requestError) {
        setError(requestError.message || "Could not fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    },
    [filters, addNotification]
  );

  useEffect(() => {
    const loadData = async () => {
      await fetchDashboardData({ showLoader: false });
    };
    loadData();
  }, [fetchDashboardData]);

  const potentialMatches = useMemo(() => buildMatches(donors, recipients), [donors, recipients]);

  const requestKeySet = useMemo(() => {
    const keySet = new Set();
    matchRequests.forEach((request) => {
      keySet.add(`${request.donorId}-${request.recipientId}`);
    });
    return keySet;
  }, [matchRequests]);

  async function handleCreateMatchRequest(match) {
    const key = `${match.donor._id}-${match.recipient._id}`;
    setActionLoadingKey(`create-${key}`);
    try {
      await createMatchRequest({ donorId: match.donor._id, recipientId: match.recipient._id });
      addNotification("New match request submitted for admin review.", "success");
      await fetchDashboardData({ showLoader: false });
    } catch (requestError) {
      addNotification(requestError.message || "Could not create match request.");
    } finally {
      setActionLoadingKey("");
    }
  }

  async function handleReviewMatchRequest(requestId, status) {
    setActionLoadingKey(`${status}-${requestId}`);
    try {
      await reviewMatchRequest(requestId, status);
      addNotification(`Match request ${status}.`, status === "approved" ? "success" : "info");
      await fetchDashboardData({ showLoader: false });
    } catch (requestError) {
      addNotification(requestError.message || "Could not review request.");
    } finally {
      setActionLoadingKey("");
    }
  }

  async function handleScheduleAppointment(requestId) {
    const appointmentAt = appointmentDraft[requestId];
    if (!appointmentAt) {
      addNotification("Choose date and time before scheduling appointment.");
      return;
    }

    setActionLoadingKey(`appointment-${requestId}`);
    try {
      await scheduleAppointment(requestId, appointmentAt);
      addNotification("Appointment scheduled successfully.", "success");
      await fetchDashboardData({ showLoader: false });
    } catch (requestError) {
      addNotification(requestError.message || "Could not schedule appointment.");
    } finally {
      setActionLoadingKey("");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow="Analytics"
          title="Donation Dashboard"
          description="Smart filters, match request approvals, appointment scheduling, and role-based actions."
        />
        <button
          type="button"
          onClick={() => fetchDashboardData({ showLoader: true })}
          className="mt-2 inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-primary-400 hover:text-primary-700"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <Search size={16} className="text-primary-600" />
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-700">Smart Search Filters</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <select
            value={filters.organ}
            onChange={(event) => setFilters((prev) => ({ ...prev, organ: event.target.value }))}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
          >
            <option value="">All Organs</option>
            {ORGAN_OPTIONS.map((organ) => (
              <option key={organ} value={organ}>
                {organ}
              </option>
            ))}
          </select>
          <select
            value={filters.bloodGroup}
            onChange={(event) => setFilters((prev) => ({ ...prev, bloodGroup: event.target.value }))}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
          >
            <option value="">All Blood Groups</option>
            {BLOOD_GROUP_OPTIONS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <select
            value={filters.urgency}
            onChange={(event) => setFilters((prev) => ({ ...prev, urgency: event.target.value }))}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
          >
            <option value="">All Urgency</option>
            {URGENCY_OPTIONS.map((urgency) => (
              <option key={urgency} value={urgency}>
                {urgency}
              </option>
            ))}
          </select>
          <input
            value={filters.city}
            onChange={(event) => setFilters((prev) => ({ ...prev, city: event.target.value }))}
            placeholder="City"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
          />
          <input
            type="number"
            min="0"
            value={filters.ageMin}
            onChange={(event) => setFilters((prev) => ({ ...prev, ageMin: event.target.value }))}
            placeholder="Age Min"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
          />
          <input
            type="number"
            min="0"
            value={filters.ageMax}
            onChange={(event) => setFilters((prev) => ({ ...prev, ageMax: event.target.value }))}
            placeholder="Age Max"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Filtered Donors" value={donors.length} />
        <StatCard label="Filtered Recipients" value={recipients.length} />
        <StatCard label="Potential Matches" value={potentialMatches.length} tone="mint" />
        <StatCard label="Match Requests" value={matchRequests.length} tone="mint" />
      </section>

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl bg-white p-6 text-slate-600 shadow-soft">
          <LoaderCircle size={18} className="animate-spin" />
          Loading dashboard data...
        </div>
      ) : null}

      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}

      {!loading && !error ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="mb-4 text-lg font-extrabold text-slate-900">Potential Matches (Request Approval)</h3>
          {potentialMatches.length === 0 ? (
            <EmptyState text="No potential matches with current filters." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {potentialMatches.map((match, index) => {
                const pairKey = `${match.donor._id}-${match.recipient._id}`;
                const alreadyRequested = requestKeySet.has(pairKey);
                const loadingKey = `create-${pairKey}`;
                return (
                  <article
                    key={`${pairKey}-${index}`}
                    className="rounded-2xl border border-mint-200 bg-gradient-to-r from-mint-50 to-white p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.13em] text-mint-700">Potential Match</p>
                    <p className="mt-2 text-sm text-slate-800">
                      <span className="font-bold">{match.donor.name}</span> with{" "}
                      <span className="font-bold">{match.recipient.name}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {match.donor.bloodGroup} - {match.donor.organ} - {match.donor.location}
                    </p>
                    <button
                      type="button"
                      disabled={alreadyRequested || actionLoadingKey === loadingKey}
                      onClick={() => handleCreateMatchRequest(match)}
                      className="mt-3 rounded-full bg-primary-600 px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {alreadyRequested ? "Request Exists" : actionLoadingKey === loadingKey ? "Submitting..." : "Request Approval"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : null}

      {!loading && !error ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="mb-4 text-lg font-extrabold text-slate-900">Approval Queue & Appointments</h3>
          {matchRequests.length === 0 ? (
            <EmptyState text="No match requests yet." />
          ) : (
            <div className="space-y-3">
              {matchRequests.map((request) => (
                <article key={request._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-900">
                      {request.donorSnapshot?.name} - {request.recipientSnapshot?.name}
                    </p>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {request.donorSnapshot?.bloodGroup} - {request.donorSnapshot?.organ} - Urgency:{" "}
                    {request.recipientSnapshot?.urgency}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {canReview ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReviewMatchRequest(request._id, "approved")}
                          disabled={request.status === "approved" || actionLoadingKey === `approved-${request._id}`}
                          className="inline-flex items-center gap-1 rounded-full bg-mint-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
                        >
                          <CheckCircle2 size={14} />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewMatchRequest(request._id, "rejected")}
                          disabled={request.status === "rejected" || actionLoadingKey === `rejected-${request._id}`}
                          className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </>
                    ) : (
                      <p className="text-xs font-semibold text-slate-500">Waiting for admin review.</p>
                    )}
                  </div>

                  {request.status === "approved" ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input
                        type="datetime-local"
                        value={appointmentDraft[request._id] || ""}
                        onChange={(event) =>
                          setAppointmentDraft((prev) => ({ ...prev, [request._id]: event.target.value }))
                        }
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-primary-500"
                        disabled={!canReview}
                      />
                      {canReview ? (
                        <button
                          type="button"
                          onClick={() => handleScheduleAppointment(request._id)}
                          disabled={actionLoadingKey === `appointment-${request._id}`}
                          className="rounded-full border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700"
                        >
                          {actionLoadingKey === `appointment-${request._id}` ? "Saving..." : "Schedule Appointment"}
                        </button>
                      ) : null}
                      {request.appointmentAt ? (
                        <p className="text-xs font-semibold text-mint-700">
                          Scheduled: {new Date(request.appointmentAt).toLocaleString()}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "approved") return <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-bold text-mint-700">Approved</span>;
  if (status === "rejected") return <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">Rejected</span>;
  return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Pending</span>;
}

function EmptyState({ text }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
      <Users size={16} />
      {text}
    </div>
  );
}

export default DashboardPage;
