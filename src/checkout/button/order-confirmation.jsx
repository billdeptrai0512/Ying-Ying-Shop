import { Heart } from 'lucide-react';
import styles from "../checkout.module.css";

export default function OrderConfirmation({ order }) {
    const total = order.total.toLocaleString();

    return (
        <div style={{ textAlign: "center" }}>
            <div className={styles.confirmationBox}>
                <Heart size={60} color="#E3C4C1" style={{ marginBottom: "2em" }} />
                <h2 className={styles.confirmationId}>{`# ${order.id}`}</h2>
                <h3 className={styles.confirmationText}>THANH TOÁN THÀNH CÔNG</h3>
                <h3 className={styles.confirmationText}>TỔNG TIỀN : {total}đ</h3>
            </div>
        </div>
    );
}
