import { HeartPulse, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotificationPanel from "./NotificationPanel";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/donor", label: "Donor" },
  { to: "/recipient", label: "Recipient" },
  { to: "/my-matches", label: "My Matches" },
  { to: "/dashboard", label: "Dashboard" },
];

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-semibold transition ${
          isActive
            ? "bg-primary-100 text-primary-700"
            : "text-slate-700 hover:bg-white hover:text-primary-700"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const visibleNavItems = isAuthenticated
    ? navItems.filter((item) => item.to !== "/dashboard" || user?.role === "Admin")
    : navItems.filter((item) => item.to === "/");

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-200/60 bg-slate-50/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-mint-500 text-white shadow-soft">
            <HeartPulse size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Organ Donation
            </p>
            <h1 className="text-base font-bold text-slate-900">LifeLink Organ Donation</h1>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {visibleNavItems.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NotificationPanel />
              <div className="hidden rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 lg:block">
                {user?.name} ({user?.role})
              </div>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-rose-200 hover:text-rose-700 md:block"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="hidden rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-bold text-primary-700 md:block"
            >
              Login
            </NavLink>
          )}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto grid w-full max-w-7xl gap-2">
            {visibleNavItems.map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} onClick={() => setIsOpen(false)} />
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="rounded-full px-4 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
              >
                Logout
              </button>
            ) : (
              <NavItem to="/login" label="Login" onClick={() => setIsOpen(false)} />
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
