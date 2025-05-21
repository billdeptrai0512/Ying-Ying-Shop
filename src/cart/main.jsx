import { useState } from "react";
import { useCart } from "../public/cartContext"
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";
import styles from "./cart.module.css"
import Demo from "./demo";
import Outfit from "./outfit";
import FormPlaceOrder from "./form";


export default function Cart() {

    const { cart , removeOutFit, editOutFit} = useCart()

    const [selectedOutFit, setSelectedOutFit] = useState(0)

    const pickOutFit = (index) => setSelectedOutFit(index)

    const isDesktop = useMediaQuery({ query: '(min-width: 1400px)'})

    if (isDesktop) {
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
                    <FormPlaceOrder cart={cart} selectedOutFit={selectedOutFit} />
                </section>
            </>
        );
    }

    // Mobile view
    return (
        <>
            <Outlet />
        </>
    );
}