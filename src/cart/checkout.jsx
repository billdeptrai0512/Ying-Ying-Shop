import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../public/cartContext"
import styles from "./cart.module.css";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import Outfit from "./outfit";
import { useWebSocket } from "../public/webSocket";
import { Copy } from 'lucide-react';

export default function CheckOut() {
    const { cart, removeOutFit, editOutFit } = useCart()
    const { orderId } = useParams();
    const { socket } = useWebSocket();
    const [order, setOrder] = useState({});
    const [total, setTotal] = useState(order.total || 0);
    const [, setSelectedOutFit] = useState(0)

    const pickOutFit = (index) => setSelectedOutFit(index)
    
    const formatCurrency = (value) => {
        if (!value) value = 0
        const intValue = Math.floor(value);
        return intValue.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + "đ";
    };

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

    return (
        <>
            <section className={styles.primary} style={{ gridColumn: "1", alignSelf: "unset" }}>
                <Outfit 
                    cart={cart} 
                    pickOutFit={pickOutFit}
                    removeOutFit={removeOutFit}
                    editOutFit={editOutFit}/>
            </section>
            <section className={styles.checkout} style={{ gridRow: "2/8", alignSelf: "unset" }}>
            <div>
                <div  style={{ textAlign: "center" }}> 
                    <img
                        src={`https://qr.sepay.vn/img?acc=20495991&bank=ACB&amount=${total}&des=YS${order.id}&template=compact`}
                        style={{ width: "70%" }}
                        alt="QR Code"
                    />
                </div>

                <div style={{ textAlign: "center", margin: "1rem", backgroundColor: "#E3C4C1" }}>
                    <h3 style={{ color: "#FFFFFF", padding: "0.5em", fontSize: "1.1em"}}>{`Đơn hàng: ${order.id}`}</h3>
                </div>

                <div style={{display: "flex", flexDirection: "row", gap: "1rem" , justifyContent: "space-around"}}>
                    <div>
                        <p className={styles.copyable}>
                            Ngân hàng : ACB
                        </p>
                        <div style={{display: "flex", gap: "0.5rem"}}>
                            <p className={styles.copyable}>
                                STK: 20495991
                            </p>
                            <Copy size={"12px"}/>
                        </div>
                        
                        <p className={styles.copyable}>
                            NGUYEN HOANG DIEU ANH
                        </p>
                    </div>

                    <div style={{display: "flex", flexDirection: "column"}}>
                        
                        <div style={{display: "flex", gap: "0.5rem"}}>
                            <p className={styles.copyable}>
                                Total: {formatCurrency(total)}
                            </p>
                            <Copy size={"12px"}/>
                        </div>

                        <div style={{display: "flex", gap: "0.5rem"}}>
                            <p className={styles.copyable}>
                                Nội dung: YY{order.id}
                            </p>
                            <Copy size={"12px"}/>
                        </div>
                        
                    </div>

                </div>
            </div>
            </section>
        </>

    );
}