import { useEffect, useState, useCallback } from "react";
import { AGENT_WS_URL } from "../constants/contracts";
import type { Incident } from "../../types/contract";

export function useAgentWebSocket() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(AGENT_WS_URL);

    websocket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === "incident") {
          setIncidents(prev => [message.data, ...prev].slice(0, 100));
        } else if (message.type === "analysis-complete") {
          console.log("Analysis complete:", message.payload);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }, [ws]);

  return {
    incidents,
    connected,
    sendMessage,
  };
}
