import { useState } from "react";
import { useCart } from "../public/cartContext"
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css"
import Outfit from "./outfit";
import Total from "./total";
import Demo from "./demo";

export default function ConfirmOrder() {

    const { cart , removeOutFit, editOutFit} = useCart()

    const [selectedOutFit, setSelectedOutFit] = useState(0)

    const pickOutFit = (index) => setSelectedOutFit(index)

    const navigate = useNavigate()

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
                <div className={styles.submit}>
                    <Total cart={cart} selectedOutFit={selectedOutFit}></Total>
                    <button className={styles.back} onClick={() => navigate('/')}>TRỞ VỀ</button> 
                    <button className={styles.cta} onClick={() => navigate('/cart/placeorder')}>CHỌN NGÀY THUÊ</button> 
                </div>
            </section>
        </>
    );
}