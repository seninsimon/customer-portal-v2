"use client";

import { useEffect, useState } from "react";
import { useNotificationSocket } from "./useNotificationSocket";
import { useMyQuotesQuery } from "@/api/query/customer-enquery";

export default function NotificationPermissionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
 const [token, setToken] = useState(null);

useEffect(() => {
  const storedToken = localStorage.getItem("ACS_TKN");
  setToken(storedToken);
}, []);

  const {
    refetch,
  } = useMyQuotesQuery("SE");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  useNotificationSocket(token, (message) => {
    console.log("🔔 WS Trigger:", message);
    if (message) {
      console.log(" overall WebSocket Trigger — Refetching Quotes...");
      refetch(); // ✅ refresh data when message arrives
    }
  });

  return <>{children}</>;
}
