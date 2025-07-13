import { useState, useEffect } from "react";
import { useCart } from "../public/cartContext"
import styles from "./cart.module.css"

export default function Total() {

    const { cart } = useCart()
    const [total, setTotal] = useState(null)
    const [count, setCount] = useState(null)

    useEffect(() => {

        if (!cart) return 

        const { itemCount, totalSum } = analyzeInventory(cart);
        setCount(itemCount);
        setTotal(totalSum);

    }, [cart]);

    // so the total and the count here is the count of all item in cart and so do total
    // TODO : implement express validator for this form

    return (
        <div className={styles.total}>
            <p>Tổng tiền ({count}): </p>
            <h3 className={styles.number}>{formatCurrency(total)}</h3>
        </div>
    )
}

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