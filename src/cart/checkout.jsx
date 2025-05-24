import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./cart.module.css";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import Total from "./total";
import { useWebSocket } from "../public/webSocket";

export default function CheckOut({ cart, selectedOutFit }) {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const isDesktop = useMediaQuery({ query: "(min-width: 1400px)" });
    const { socket } = useWebSocket();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/checkout/${orderId}`, {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                });

                console.log("Order details:", response.data);
                setOrder(response.data);

            } catch (err) {
                console.error("Error fetching order details:", err);
            }
        }

        fetchData();
    }, [orderId]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Message from backend:", data);

                if (data.orderId === orderId) {
                    setOrder((prevOrder) => ({
                        ...prevOrder,
                        paid_status: data.paid_status,
                    }));
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error.message);
            }
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket, orderId]);

    return (
        <section className={styles.primary}>
            <h2>#{order.id ? order.id : "Loading..."}</h2>
            { order.paid_status === true ? (
                <h3 className={styles.success}>Đã thanh toán thành công</h3>
            ) : (
                <h3 className={styles.error}>Chưa thanh toán</h3>
            )}
            <div>
                <p onClick={() => navigator.clipboard.writeText("MB Bank")} className={styles.copyable}>
                    MB Bank
                </p>
                <p onClick={() => navigator.clipboard.writeText("Account name : player2player")} className={styles.copyable}>
                    Account name : player2player
                </p>
                <p onClick={() => navigator.clipboard.writeText(`Total: ${order.total}`)} className={styles.copyable}>
                    Total: {order.total}đ
                </p>
                <p onClick={() => navigator.clipboard.writeText(`Description: YY${order.id}`)} className={styles.copyable}>
                    Description: YY{order.id}
                </p>
            </div>
            <img
                src={`https://qr.sepay.vn/img?acc=player2player&bank=MB&amount=2000&des=YY${order.id}`}
                alt="QR Code"
            />

            <div className={styles.submit}>
                <Total cart={cart} selectedOutFit={selectedOutFit}></Total>
                <button className={styles.back} onClick={() => navigate(isDesktop ? "/" : "/cart")}>
                    TRỞ VỀ
                </button>
                <button className={styles.cta} type="submit">
                    CHECKOUT
                </button>
            </div>
        </section>
    );
}