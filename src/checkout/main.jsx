import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../public/cartContext"
import { useMediaQuery } from "react-responsive";
import styles from "./checkout.module.css";
import axios from "axios";

import Outfit from "../cart/outfit";
import Demo from "../cart/demo";
import Bill from "./bill";
import Total from "./total";

export default function CheckOut() {

    const { cart, removeOutFit, editOutFit } = useCart()
    const { orderId } = useParams();

    const [order, setOrder] = useState({});
    const [updateOrder, setUpdateOrder] = useState(false)
    const [selectedOutFit, setSelectedOutFit] = useState(0)
    const [paidStatus, setPaidStatus] = useState(null);

    const pickOutFit = (index) => setSelectedOutFit(index)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/checkout/${orderId}`, {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    }
                });
                console.log("Order details:", response.data);
                setOrder(response.data);
                setPaidStatus(response.data.paid_status);

            } catch (err) {
                console.error("Error fetching order details:", err);
            }
        }

        fetchData();
    }, [orderId, updateOrder]);

    const isDeskop = useMediaQuery({ query: '(min-width: 1400px)'})
    const isMobile = useMediaQuery({ query: '(max-width: 1000px)'})

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
                        editOutFit={editOutFit} 
                        paidStatus={paidStatus}/>
                </section>
                <section className={styles.checkout}>
                    <Bill order={order} paidStatus={paidStatus} setPaidStatus={setPaidStatus} setUpdateOrder={setUpdateOrder}/>
                </section>
            </>
        );

    }

    if (isMobile) {
        return (
            
            <section className={styles.checkout} style={{ gridRow: "1/8"}}>
                <Bill order={order} paidStatus={paidStatus} setPaidStatus={setPaidStatus} setUpdateOrder={setUpdateOrder}/>
            </section>    
            
        );
    }

    return (
        <>
            <section className={styles.primary} style={{gridColumn: "1", position: "absolute", minWidth: "unset"}}>
                <Outfit 
                    cart={cart} 
                    pickOutFit={pickOutFit}
                    removeOutFit={removeOutFit}
                    paidStatus={paidStatus}
                    editOutFit={editOutFit} />
            </section>
            <section className={styles.checkout} style={{ gridRow: "1/8"}}>
                <Bill order={order} paidStatus={paidStatus} setPaidStatus={setPaidStatus} setUpdateOrder={setUpdateOrder}/>
            </section>
        </>
    );

}