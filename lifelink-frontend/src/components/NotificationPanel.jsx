import { Bell, CheckCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../contexts/NotificationContext";

function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">Notifications</p>
            <button type="button" onClick={clearAll} className="text-xs font-semibold text-slate-500 hover:text-slate-700">
              Clear all
            </button>
          </div>
          <div className="max-h-80 space-y-2 overflow-auto">
            {notifications.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">No notifications yet.</p>
            ) : (
              notifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => markAsRead(item.id)}
                  className={`w-full rounded-xl p-3 text-left transition ${
                    item.read ? "bg-slate-50 text-slate-600" : "bg-primary-50 text-slate-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {item.type === "success" ? (
                      <CheckCheck size={14} className="mt-0.5 text-mint-600" />
                    ) : (
                      <XCircle size={14} className="mt-0.5 text-primary-600" />
                    )}
                    <div>
                      <p className="text-xs font-semibold">{item.message}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default NotificationPanel;
