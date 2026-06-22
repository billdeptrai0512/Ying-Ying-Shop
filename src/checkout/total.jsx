import { useState, useEffect } from "react";
import { formatCurrency, analyzeInventory } from "../public/money"
import styles from "./checkout.module.css"

export default function Total({ cart, selectedOutFit }) {

    const [total, setTotal] = useState(null)
    const [count, setCount] = useState(null)

    useEffect(() => {
        if (cart) {
            const { itemCount, totalSum } = analyzeInventory(cart);
            setCount(itemCount);
            setTotal(totalSum);
        }
    }, [cart, selectedOutFit]);

    // so the total and the count here is the count of all item in cart and so do total
    // TODO : implement express validator for this form

    return (
        <div className={styles.total}>
            <p>Tổng tiền ({count}): </p>
            <h3 className={styles.number}>{formatCurrency(total)}</h3>
        </div>
    )
}
