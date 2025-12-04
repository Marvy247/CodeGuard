import { useEffect, useState, useCallback } from "react";
import { AGENT_WS_URL } from "../constants/contracts";
import type { Incident } from "../../types/contract";

export function useAgentWebSocket() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Try to connect to agents WebSocket (optional for demo)
    try {
      const websocket = new WebSocket(AGENT_WS_URL);

      websocket.onopen = () => {
        console.log("✅ Agent WebSocket connected");
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
          // Silent fail - not critical
        }
      };

      websocket.onerror = () => {
        // Agents not running - this is okay for demo
        setConnected(false);
      };

      websocket.onclose = () => {
        setConnected(false);
      };

      setWs(websocket);

      return () => {
        try {
          websocket.close();
        } catch {
          // Silent cleanup
        }
      };
    } catch (error) {
      // WebSocket connection failed - agents not running
      // This is expected and okay for demo mode
      setConnected(false);
    }
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
