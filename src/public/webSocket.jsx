import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        let ws;

        const connectWebSocket = () => {
            ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}`);

            ws.onopen = () => {
                console.log("WebSocket connection established");
                setSocket(ws);
            };

            ws.onmessage = (event) => {
                console.log("Message from server:", event.data);
                try {
                    const parsedData = JSON.parse(event.data);
                    setMessages((prevMessages) => [...prevMessages, parsedData]);
                } catch (err) {
                    console.error("Error parsing WebSocket message:", err);
                }
            };

            ws.onclose = () => {
                console.log("WebSocket connection closed. Attempting to reconnect...");
                setSocket(null);
                setTimeout(connectWebSocket, 5000); // Retry connection after 5 seconds
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        };

        connectWebSocket();

        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not open. Cannot send message:", message);
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