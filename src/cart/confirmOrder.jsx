import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import styles from "./cart.module.css"
import Outfit from "../cart/outfit";
import Total from "../cart/total";
import Demo from "../cart/demo";
import FormPlaceOrder from "./form/placeOrder";

export default function ConfirmOrder() {

    const [selectedOutFit, setSelectedOutFit] = useState(0)

    const pickOutFit = (index) => setSelectedOutFit(index)

    const navigate = useNavigate()

    const isDeskop = useMediaQuery({ query: '(min-width: 1400px)'})

    if (isDeskop) {
        return (
            <>
                <section className={styles.main}>
                   <Demo selectedOutFit={selectedOutFit} />
                </section>
                <section className={styles.primary}>
                    <Outfit pickOutFit={pickOutFit}/>
                </section>
                <section className={styles.checkout}>
                    <FormPlaceOrder formId={"placeOrderForm"} />
                    <div className={styles.submit}>
                        <Total />
                        <button className={styles.back} onClick={() => navigate('/')}>TRỞ VỀ</button> 
                        <button className={styles.cta} type="submit" form="placeOrderForm">THANH TOÁN</button> 
                    </div>
                </section>
            </>
        )
    }

    return (
        <>
            <section className={styles.main}>
                <Demo selectedOutFit={selectedOutFit} />
            </section>
            <section className={styles.primary}>
                <Outfit pickOutFit={pickOutFit}/>
            </section>
            <section className={styles.checkout}>
                <div className={styles.submit}>
                    <Total />
                    <button className={styles.back} onClick={() => navigate('/')}>TRỞ VỀ</button> 
                    <button className={styles.cta} onClick={() => navigate('/cart/placeorder')}>CHỌN NGÀY THUÊ</button> 
                </div>
            </section>
        </>
    );
}