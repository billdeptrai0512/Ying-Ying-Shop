import styles from "./Cart.module.css"

export default function Total({cart, selectedOutFit}) {

    const formatCurrency = (value) => {
        const intValue = Math.floor(value);
        return intValue.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + "đ";
    };

    return (
        <div className={styles.total}>
            Tong tien : {formatCurrency(cart[selectedOutFit].total)}
        </div>
    )
}