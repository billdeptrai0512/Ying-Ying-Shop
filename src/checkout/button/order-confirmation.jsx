import styles from "../checkout.module.css";

export default function OrderConfirmation({ order }) {
    const total = order.total.toLocaleString();

    return (
        <div className={styles.confirmationWrapper}>
            {/* Confetti particles */}
            <div className={styles.confetti} style={{ '--c': '#ff4b4b', '--x': '-40px', '--y': '-60px', '--d': '0s' }} />
            <div className={styles.confetti} style={{ '--c': '#4CAF50', '--x': '40px', '--y': '-50px', '--d': '0.1s' }} />
            <div className={styles.confetti} style={{ '--c': '#2196F3', '--x': '-60px', '--y': '-20px', '--d': '0.2s' }} />
            <div className={styles.confetti} style={{ '--c': '#FFC107', '--x': '60px', '--y': '-10px', '--d': '0.15s' }} />

            <div className={styles.confirmationBox}>
                <div className={styles.iconContainer}>
                    {/* Animated Checkmark SVG */}
                    <svg className={styles.animatedCheck} viewBox="0 0 52 52">
                        <circle className={styles.checkCircle} cx="26" cy="26" r="25" fill="none" />
                        <path className={styles.checkPath} fill="none" stroke="#fff" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>

                <div className={styles.successTitle}>
                    <h2>Mã đơn: #{order.id}</h2>
                    <p className={styles.confirmationId}>THANH TOÁN THÀNH CÔNG</p>
                </div>

                <div className={styles.amountBadge}>
                    <span>{total}₫</span>
                </div>
            </div>
        </div>
    );
}
