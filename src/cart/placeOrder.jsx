import { useState } from "react";
import { useCart } from "../public/cartContext"
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css"
import FormPlaceOrder from "./form/placeOrder";
import Demo from "../cart/demo";
import Outfit from "../cart/outfit";
import Total from "../cart/total";

export default function PlaceOrder() {

    const navigate = useNavigate()

    const { cart, removeOutFit, editOutFit } = useCart()

    const [selectedOutFit, setSelectedOutFit] = useState(0)

    const pickOutFit = (index) => setSelectedOutFit(index)

    const isMobile = useMediaQuery({ query: '(max-width: 1000px)'})

    if (isMobile) {
        return (
            <>  
                <section className={styles.main}>
                    <FormPlaceOrder cart={cart} selectedOutFit={selectedOutFit} formId={"placeOrderForm"} />
                </section>
                <section className={styles.primary}>
                    <Outfit 
                        cart={cart} 
                        pickOutFit={pickOutFit}
                        removeOutFit={removeOutFit}
                        editOutFit={editOutFit}/>
                </section>
                <section className={styles.checkout}>
                    <div className={styles.submit}>
                        <Total cart={cart} selectedOutFit={selectedOutFit}></Total> 
                        <button className={styles.back} onClick={() => navigate(isMobile ? '/cart' : '/')}>TRỞ VỀ</button> 
                        <button className={styles.cta} type="submit" form="placeOrderForm">THANH TOÁN</button>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <section className={styles.primary} style={{gridColumn: "1", position: "absolute", minWidth: "unset"}}>
                <Outfit 
                    cart={cart} 
                    pickOutFit={pickOutFit}
                    removeOutFit={removeOutFit}
                    editOutFit={editOutFit}/>
            </section>
            <section className={styles.checkout} style={{gridRow: "1/8"}}>
                <FormPlaceOrder cart={cart} selectedOutFit={selectedOutFit} formId={"placeOrderForm"}/>
                <div className={styles.submit} style={{padding: "1em 1.6em"}}>
                    <Total cart={cart} selectedOutFit={selectedOutFit}></Total> 
                    <button className={styles.back} onClick={() => navigate('/cart')}>TRỞ VỀ</button> 
                    <button className={styles.cta} type="submit" form="placeOrderForm">THANH TOÁN</button>
                </div>
            </section>
        </>
    );
}