import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css"
import FormPlaceOrder from "./form/placeOrder";
import Outfit from "../cart/outfit";
import Total from "../cart/total";

export default function PlaceOrder() {

    const navigate = useNavigate()

    const [, setSelectedOutFit] = useState(0)

    const pickOutFit = (index) => setSelectedOutFit(index)

    const isMobile = useMediaQuery({ query: '(max-width: 1000px)'})

    if (isMobile) {
        return (
            <>  
                <section className={styles.main}>
                    <FormPlaceOrder formId={"placeOrderForm"} />
                </section>
                <section className={styles.primary}>
                    <Outfit pickOutFit={pickOutFit} />
                </section>
                <section className={styles.checkout}>
                    <div className={styles.submit}>
                        <Total /> 
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
                <Outfit pickOutFit={pickOutFit}/>
            </section>
            <section className={styles.checkout} style={{gridRow: "1/8"}}>
                <FormPlaceOrder formId={"placeOrderForm"}/>
                <div className={styles.submit} style={{padding: "1em 1.6em"}}>
                    <Total />
                    <button className={styles.back} onClick={() => navigate('/cart')}>TRỞ VỀ</button> 
                    <button className={styles.cta} type="submit" form="placeOrderForm">THANH TOÁN</button>
                </div>
            </section>
        </>
    );
}