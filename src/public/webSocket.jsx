import { createContext, useContext, useEffect, useState, useRef } from "react";

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const reconnectRef = useRef(null); // prevent duplicate reconnects

    useEffect(() => {
        let ws;

        const connectWebSocket = () => {
            if (ws) ws.close(); // Cleanup old one just in case

            ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

            ws.onopen = () => {
                console.log("WebSocket connected");
                setSocket(ws);
            };

            ws.onmessage = (event) => {
                try {
                    const parsed = JSON.parse(event.data);
                    setMessages((prev) => [...prev, parsed]);
                } catch (e) {
                    console.error("WebSocket JSON error:", e);
                }
            };

            ws.onclose = () => {
                console.warn("WebSocket closed. Reconnecting...");
                setSocket(null);

                // Prevent multiple reconnects
                if (!reconnectRef.current) {
                    reconnectRef.current = setTimeout(() => {
                        reconnectRef.current = null;
                        connectWebSocket();
                    }, 5000);
                }
            };

            ws.onerror = (err) => {
                console.error("WebSocket error:", err);
                ws.close(); // force reconnect path
            };
        };

        connectWebSocket();

        return () => {
            if (ws) ws.close();
            if (reconnectRef.current) {
                clearTimeout(reconnectRef.current);
                reconnectRef.current = null;
            }
        };
    }, []);

    const sendMessage = (msg) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(msg));
        } else {
            console.warn("WebSocket not open:", msg);
        }
    };

    return (
        <WebSocketContext.Provider value={{ socket, messages, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
}


// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocket = () => useContext(WebSocketContext);