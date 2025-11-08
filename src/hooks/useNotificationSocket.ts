import { useEffect } from "react";
const baseUrl = "dev.meridian.ociuzerp.in"

export const useNotificationSocket = (token, onMessage) => {
  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`wss://${baseUrl}/ws/notifications/?token=${encodeURIComponent(token)}`);

    console.log("ws", ws);
    ws.onopen = () => console.log("✅ Connected");
    ws.onclose = () => console.log("❌ Closed");
  ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type !== "pong") {
          console.log({data});
          onMessage?.(data);
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(data.title || "New Update", { body: data.message });
          }
        }
      } catch (err) {
        console.error("Invalid WS message:", err);
      }
    };
    ws.onclose = () => console.log("❌ WebSocket closed");

    // optional keep-alive
    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "ping" }));
    }, 30000);

    return () => {
      clearInterval(ping);
      ws.close();
    };
  }, [token, onMessage]);
};
