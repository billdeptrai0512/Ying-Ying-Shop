import { useState, useEffect } from "react";
import styles from "./Cart.module.css"

export default function Total({cart, selectedOutFit}) {

    const [total, setTotal] = useState(null)
    const [count, setCount] = useState(null)

    const formatCurrency = (value) => {
        if (!value) value = 0
        const intValue = Math.floor(value);
        return intValue.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + "đ";
    };

    const analyzeInventory = (data) => {
        let itemCount = 0;
        let totalSum = 0;
      
        data.forEach(entry => {
          Object.values(entry).forEach(value => {
            // Check if this field is an object with an `item` key
            if (value && typeof value === 'object' && 'item' in value) {
              if (value.item !== null) {
                itemCount += 1;
              }
            }
          });
      
          if (typeof entry.total === 'number') {
            totalSum += entry.total;
          }
        });
      
        return { itemCount, totalSum };
    };

    useEffect(() => {
        if (cart) {
            const { itemCount, totalSum } = analyzeInventory(cart);
            setCount(itemCount);
            setTotal(totalSum);
        }
    }, [cart, selectedOutFit]);

    // so the total and the count here is the count of all item in cart and so do total

    return (
      <> 
        <div className={styles.total}>
            <p>Tổng ({count})</p>
            <div className={styles.number}>{formatCurrency(total)}</div>
        </div>
        <button className={styles.cta}>ĐẶT CỌC</button>
      </>
    )
}