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

    const analyzeInventory = (cart) => {
        let itemCount = 0;
        let totalSum = 0;

        // console.log(data)
        const countItems = (section) => {
          if (section && typeof section === 'object') {
              if ('item' in section) {
                  if (section.item !== null) {
                      itemCount += 1;
                  }
              }
  
              // Recursively check nested objects
              Object.values(section).forEach(value => {
                  if (typeof value === 'object') {
                      countItems(value);
                  }
              });
          }
        };
      
        cart.forEach(outfit => {
          Object.values(outfit).forEach(section => {
              countItems(section);
          });
  
          if (typeof outfit.total === 'number') {
              totalSum += outfit.total;
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