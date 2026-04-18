import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@lifelink.org");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (loginError) {
      setError(loginError.message || "Could not login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        eyebrow="Secure Access"
        title="Login To LifeLink"
        description="Role-based access for Admin, Donor, and Recipient."
      />
      <form onSubmit={handleLogin} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="mb-4 rounded-xl bg-primary-50 p-3 text-xs text-primary-700">
          Demo users:
          <div>`admin@lifelink.org / admin123`</div>
          <div>`donor@lifelink.org / donor123`</div>
          <div>`recipient@lifelink.org / recipient123`</div>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            />
          </label>
        </div>
        {error ? <p className="mt-4 text-sm font-semibold text-rose-700">{error}</p> : null}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-mint-500 px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {isLoading ? <LoaderCircle size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
