import styles from "./Cart.module.css"

export default function Total({cart, selectedOutFit}) {

    const formatCurrency = (value) => {
        if (!value) value = 0
        const intValue = Math.floor(value);
        return intValue.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + "đ";
    };

    //bug when cart[selectedOutFit] removed 
    const total = cart[selectedOutFit] ? cart[selectedOutFit].total : null

    return (
        <div className={styles.total}>
            Tong tien : {formatCurrency(total)}
        </div>
    )
}