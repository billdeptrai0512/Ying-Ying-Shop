import { useState } from "react";
import { useCart } from "../public/cartContext"
import { useMediaQuery } from "react-responsive";
import styles from "./cart.module.css"
import Demo from "./demo";
import FormPlaceOrder from "./form";

export default function PlaceOrder() {

    const { cart, } = useCart()

    const [selectedOutFit, ] = useState(0)

    const isMobile = useMediaQuery({ query: '(max-width: 1000px)'})

    if (isMobile) {
        return (
            <>
                <section className={styles.checkout}>
                    <FormPlaceOrder cart={cart} selectedOutFit={selectedOutFit} />
                </section>
            </>
        );
    }

    return (
        <>
            <section className={styles.main}>
                <Demo cart={cart} selectedOutFit={selectedOutFit} />
            </section>
            <section className={styles.checkout} style={{gridRow: "2/8"}}>
                <FormPlaceOrder cart={cart} selectedOutFit={selectedOutFit} />
            </section>
        </>
    );
}