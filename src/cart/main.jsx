import { useState } from "react";
import { useCart } from "../public/cartContext"
import styles from "./cart.module.css"
import Demo from "./demo";
import Outfit from "./outfit";
import Total from "./total";

export default function Cart() {

    const { cart , removeOutFit, editOutFit} = useCart()

    const [selectedOutFit, setSelectedOutFit] = useState(0)

    const pickOutFit = (index) => setSelectedOutFit(index)

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
            {/* <section className={styles.checkout}>
                <Total 
                    cart={cart}
                    selectedOutFit={selectedOutFit} 
                />
            </section> */}
        </>
    );
}