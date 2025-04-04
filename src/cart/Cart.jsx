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
            <Demo 
                cart={cart}
                selectedOutFit={selectedOutFit}
            />
            <div className={styles.primary}>
                <Outfit 
                    cart={cart} 
                    pickOutFit={pickOutFit}
                    removeOutFit={removeOutFit}
                    editOutFit={editOutFit}/>
            </div>
            <div className={styles.secondary}>
                <Total 
                    cart={cart}
                    selectedOutFit={selectedOutFit} 
                />
            </div>
        </div>
    );
}