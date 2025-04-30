import { useState } from "react";
import { useCart } from "../main";
import styles from "./Cart.module.css"
import Demo from "./Demo";
import Outfit from "./Outfit";
import Total from "./Total";

export default function Cart() {

    const { cart , removeOutFit, editOutFit} = useCart()

    const [selectedOutFit, setSelectedOutFit] = useState(0)

    const pickOutFit = (index) => setSelectedOutFit(index)

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
                    editOutFit={editOutFit}/>
            </section>
            <section className={styles.checkout}>
                <Total 
                    cart={cart}
                    selectedOutFit={selectedOutFit} 
                />
            </section>
        </div>
    );
}