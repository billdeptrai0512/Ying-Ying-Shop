import styles from "./checkout.module.css";
import { useState, useEffect } from "react";
import { Heart } from 'lucide-react';
import { useCart } from "../public/cartContext"
import { useWebSocket } from "../public/webSocket";
import axios from "axios";
import ScreenShotButton from "./screenshot";
import CopyButton from "./copyButton";

export default function Bill({order}) {

    const { cart } = useCart()
    const { socket } = useWebSocket();

    const [total, setTotal] = useState(null)
    const [count, setCount] = useState(null)
    const [displayTotal, setDisplayTotal] = useState(null)
    const [paidStatus, setPaidStatus] = useState(order.paid_status);

    const formatCurrency = (value) => {
        if (!value) value = 0
        const intValue = Math.floor(value);
        return intValue.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + "đ";
    };

    const analyzeInventory = (cart) => {
        let itemCount = 0;
        let totalSum = 0;

        const countItems = (section) => {
            if (section && typeof section === 'object') {
                if ('item' in section) {
                    if (section.item !== null) {
                        itemCount += 1;
                    }
                }
    
                Object.values(section).forEach(value => {
                    if (typeof value === 'object') {
                        countItems(value);
                    }
                });
            }
        };
        
        cart.forEach(outfit => {
            Object.values(outfit).forEach(section => {
                countItems(section);
            });
    
            if (typeof outfit.total === 'number') {
                totalSum += outfit.total;
            }
        });

        const displayTotal = formatCurrency(totalSum);
        
        return { itemCount, totalSum, displayTotal };
    };

    const getAllItem = (cart) => {
        return cart.flatMap(outfit => {
            const items = [];
            if (outfit.extra) {
                if (outfit.extra.neck?.item) items.push(outfit.extra.neck.item);
                if (outfit.extra.bag?.item) items.push(outfit.extra.bag.item);
            }
            if (outfit.size) items.push(outfit.size.item);
            return items;
        });
    };

    useEffect(() => {
        if (cart) {
            const { itemCount, totalSum, displayTotal } = analyzeInventory(cart);
            setCount(itemCount);
            setTotal(totalSum);
            setDisplayTotal(displayTotal)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[cart]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Message from backend:", data);

                if (data.id === order.id) {

                    setPaidStatus(data.paid_status);

                    const updateInformation = {
                        total: cart.reduce((acc, item) => acc + item.total, 0),
                        cart: getAllItem(cart),
                    };

                    console.log("Updated cart information:", updateInformation);

                    // Use axios.patch to update the backend
                    axios.patch(`${import.meta.env.VITE_BACKEND_URL}/place-order/edit/${order.id}`, updateInformation, {
                        headers: {
                            "ngrok-skip-browser-warning": "true",
                        },
                    })

                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error.message);
            }
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };

    }, [socket, order.id, cart]);

    const bank = import.meta.env.VITE_BANK
    const account = import.meta.env.VITE_BANK_ACCOUNT
    
    return (
        <div>
            <div id="screenshot-area" style={{ textAlign: "center" }}>
                {paidStatus ? (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#453130", minHeight: "20em", gap: "0.5em", margin: "1em" }}>
                        <Heart size={60} color="#E3C4C1" style={{ marginBottom: "2em" }} />
                        <h2 style={{ fontSize: "1em", color: "#FFFFFF" }}>THANH TOÁN THÀNH CÔNG </h2>
                        <h3 style={{ fontSize: "1em", color: "#FFE1E1" }}>TỔNG TIỀN : {displayTotal} </h3>
                    </div>
                ) : (
                    <img
                        id="qr-code"
                        src={`https://qr.sepay.vn/img?acc=${account}&bank=${bank}&amount=${total}&des=YS${order.id}&template=compact`}
                        style={{ width: "90%" }}
                        alt="QR Code"
                        crossOrigin="anonymous"
                    />
                )}
            </div>

            <div style={{ textAlign: "center", margin: "1rem", backgroundColor: "#E3C4C1" }}>
                <h3 style={{ color: "#FFFFFF", padding: "0.5em", fontSize: "1.1em"}}>{`Đơn hàng: ${order.id}`}</h3>
            </div>

            <div style={{display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center", marginTop: "2em", padding: "0 1em"}}>

                {/* have paid */}
                {paidStatus ? (
                    <> 
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            
                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <p className={styles.copyable}>
                                        Họ và tên: 
                                </p>
                            </div>
                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <p className={styles.copyable}>
                                    {order.name}
                                </p>
                                <CopyButton value={displayTotal} />
                            </div>
                        </div>

                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            
                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <p className={styles.copyable}>
                                    Số điện thoại:  
                                </p>
                            </div>

                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <p className={styles.copyable}>
                                 (+84) {order.phone} 
                                </p>
                                <CopyButton value={displayTotal} />
                            </div>
                            
                        </div>

                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            
                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <p className={styles.copyable}>
                                    {`Đặt ${count} sản phẩm`}
                                </p>
                            </div>

                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <p className={styles.copyable}>                         
                                    {new Date(order.date).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </p>
                                <CopyButton value={displayTotal} />
                            </div>
                            
                        </div>

                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            
                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <p className={styles.copyable}>
                                    Địa chỉ nhận hàng:
                                </p>
                            </div>

                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <p className={styles.copyable}>
                                    {`${order.address}`}
                                </p>
                                <CopyButton value={displayTotal} />
                            </div>
                            
                        </div>
                    </>
                ) : (
                // unpaid status
                    <> 
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <p className={styles.copyable}>
                                Ngân hàng : ACB
                            </p>
                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <p className={styles.copyable}>
                                    STK: 20495991
                                </p>
                                <CopyButton value={"20495991"} />
                            </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            
                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <p className={styles.copyable}>
                                    Tổng tiền: {displayTotal} 
                                </p>
                                <CopyButton value={displayTotal} />
                            </div>

                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <p className={styles.copyable}>
                                    Nội dung: YS{order.id}
                                </p>
                                <CopyButton value={`YS${order.id}`} />
                            </div>
                            
                        </div>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <p className={styles.copyable}>
                                NGUYEN HOANG DIEU ANH
                            </p>
                            <p className={styles.copyable}>
                                {`Cho thuê: ${count} sản phẩm`}
                            </p>
                        </div>

                    </>
                )}

            </div>

            <ScreenShotButton />
            
        </div>
    );

}