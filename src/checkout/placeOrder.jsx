import { useState } from "react";
import { useCart } from "../public/cartContext"
import { useMediaQuery } from "react-responsive";
import styles from "./checkout.module.css"
import FormPlaceOrder from "./form";
import Demo from "../cart/demo";
import Outfit from "../cart/outfit";

export default function PlaceOrder() {

    const { cart, removeOutFit, editOutFit } = useCart()

    const [selectedOutFit, setSelectedOutFit] = useState(0)

    const pickOutFit = (index) => setSelectedOutFit(index)

    const isMobile = useMediaQuery({ query: '(max-width: 1000px)'})

    if (isMobile) {
        return (
            <>
                <section className={styles.primary}>
                    <Outfit 
                        cart={cart} 
                        pickOutFit={pickOutFit}
                        removeOutFit={removeOutFit}
                        editOutFit={editOutFit}/>
                </section>
                <section className={styles.checkout}>
                    <FormPlaceOrder cart={cart} selectedOutFit={selectedOutFit} />
                </section>
            </>
        );
    }

    return (
        <>
            <section className={styles.primary} style={{gridColumn: "1"}}>
                <Outfit 
                    cart={cart} 
                    pickOutFit={pickOutFit}
                    removeOutFit={removeOutFit}
                    editOutFit={editOutFit}/>
            </section>
            <section className={styles.checkout} style={{gridRow: "2/8"}}>
                <FormPlaceOrder cart={cart} selectedOutFit={selectedOutFit} />
            </section>
        </>
    );
}