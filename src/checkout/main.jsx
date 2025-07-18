import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../public/cartContext"
import { useMediaQuery } from "react-responsive";
import styles from "./checkout.module.css";

import Outfit from "../cart/outfit";
import Demo from "../cart/demo";
import Bill from "./bill";

export default function CheckOut() {

    const { cart, removeOutFit, editOutFit } = useCart()
    const { orderId } = useParams();

    const [selectedOutFit, setSelectedOutFit] = useState(0)
    const pickOutFit = (index) => setSelectedOutFit(index)

    const isDeskop = useMediaQuery({ query: '(min-width: 1400px)'})
    const isMobile = useMediaQuery({ query: '(max-width: 1000px)'})

    if (isDeskop) {

        return (
            <div className={styles.body}>
                <section className={styles.main}>
                    <Demo cart={cart} selectedOutFit={selectedOutFit} />
                </section>
                <section className={styles.primary}>
                    <Outfit 
                        cart={cart} 
                        pickOutFit={pickOutFit}
                        removeOutFit={removeOutFit}
                        editOutFit={editOutFit} />
                </section>
                <section className={styles.checkout}>
                    <Bill orderId={orderId} />
                </section>
            </div>
        );

    }

    if (isMobile) {
        return (
            <div className={styles.body}>
                <section className={styles.checkout} style={{ gridRow: "1/8"}}>
                    <Bill orderId={orderId} />
                </section>    
            </div>
        );
    }

    return (
        <div className={styles.body}>
            <section className={styles.primary} style={{gridColumn: "1", position: "absolute", minWidth: "unset"}}>
                <Outfit 
                    cart={cart} 
                    pickOutFit={pickOutFit}
                    removeOutFit={removeOutFit}
                    editOutFit={editOutFit} />
            </section>
            <section className={styles.checkout} style={{ gridRow: "1/8"}}>
                <Bill orderId={orderId} />
            </section>
        </div>
    );

}