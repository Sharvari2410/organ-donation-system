/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lifelinkNotifications") || "[]");
    } catch {
      return [];
    }
  });

  function persist(next) {
    setNotifications(next);
    localStorage.setItem("lifelinkNotifications", JSON.stringify(next));
  }

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      addNotification(message, type = "info") {
        const next = [
          {
            id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            message,
            type,
            read: false,
            createdAt: new Date().toISOString(),
          },
          ...notifications,
        ].slice(0, 40);
        persist(next);
      },
      markAsRead(id) {
        persist(notifications.map((item) => (item.id === id ? { ...item, read: true } : item)));
      },
      clearAll() {
        persist([]);
      },
    }),
    [notifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }
  return context;
}
