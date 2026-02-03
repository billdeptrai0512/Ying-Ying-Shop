import styles from "../checkout.module.css";
import CopyButton from "./copy";

const bank = import.meta.env.VITE_BANK;
const account = import.meta.env.VITE_BANK_ACCOUNT;

export default function QRCodeSection({ order }) {
    return (
        <div style={{ textAlign: "center" }}>
            <img
                className={styles.qr}
                id="qr-code"
                src={`https://qr.sepay.vn/img?acc=${account}&bank=${bank}&amount=${order.total.toLocaleString()}&des=YS${order.id}&template=compact`}
                alt="QR Code"
                crossOrigin="anonymous"
            />
        </div>
    );
}

export function BankInfo() {
    return (
        <>
            <div className={styles.infoRow}>
                <p className={styles.copyable}>Ngân hàng : ACB</p>
                <div className={styles.infoValue}>
                    <p className={styles.copyable}>STK: 20495991</p>
                    <CopyButton value={"20495991"} />
                </div>
            </div>
            <div className={styles.infoRow}>
                <p className={styles.copyable}>NGUYEN HOANG DIEU ANH</p>
            </div>
        </>
    );
}

export function TotalInfo({ order }) {
    const total = order.total.toLocaleString();

    return (
        <div className={styles.infoRow}>
            <div className={styles.infoValue}>
                <p className={styles.copyable}>Tổng tiền: {total}đ</p>
                <CopyButton value={total} />
            </div>
            <div className={styles.infoValue}>
                <p className={styles.copyable}>Nội dung: YS{order.id}</p>
                <CopyButton value={`YS${order.id}`} />
            </div>
        </div>
    );
}
