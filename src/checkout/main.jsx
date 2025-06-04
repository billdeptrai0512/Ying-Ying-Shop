import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../public/cartContext"
import { useMediaQuery } from "react-responsive";
import styles from "./checkout.module.css";
import axios from "axios";
import { useWebSocket } from "../public/webSocket";

import Outfit from "../cart/outfit";
import Demo from "../cart/demo";
import Bill from "./bill";

export default function CheckOut() {
    const { cart, removeOutFit, editOutFit } = useCart()
    const { orderId } = useParams();
    const { socket } = useWebSocket();

    const [order, setOrder] = useState({});
    const [total, setTotal] = useState(order.total || 0);
    const [selectedOutFit, setSelectedOutFit] = useState(0)

    const pickOutFit = (index) => setSelectedOutFit(index)

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
        if (cart) {

            let totalSum = 0

            cart.forEach(outfit => {

                if (typeof outfit.total === 'number') {
                    totalSum += outfit.total;
                }
            });

            setTotal(totalSum);
        }

    }, [cart]);

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

                //TODO we also wanna check the cart that user paid for, and then update the order database with new cart / total

            } catch (error) {
                console.error("Error parsing WebSocket message:", error.message);
            }
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket, orderId]);

    const isDeskop = useMediaQuery({ query: '(min-width: 1400px)'})

    if (isDeskop) {

        return (
            <>
                <section className={styles.main}>
                    <Demo cart={cart} selectedOutFit={selectedOutFit} />
                </section>
                <section className={styles.primary}>
                    <Outfit 
                        cart={cart} 
                        pickOutFit={pickOutFit}
                        removeOutFit={removeOutFit}
                        editOutFit={editOutFit}/>
                </section>
                <section className={styles.checkout}>
                    <Bill total={total} order={order} />
                </section>
            </>
        );

    }

    return (
        <>
            <section className={styles.primary} style={{ gridColumn: "1"}}>
                <Outfit 
                    cart={cart} 
                    pickOutFit={pickOutFit}
                    removeOutFit={removeOutFit}
                    editOutFit={editOutFit}/>
            </section>
            <section className={styles.checkout} style={{ gridRow: "2/8"}}>
                <Bill total={total} order={order} />
            </section>
        </>
    );
}