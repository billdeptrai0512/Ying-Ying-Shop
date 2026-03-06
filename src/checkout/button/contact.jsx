import styles from "../checkout.module.css";
import { Phone, Mail } from 'lucide-react';

export default function ContactButton() {
    return (
        <a
            href="https://www.facebook.com/messages/t/449980314869577"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.actionBtn} ${styles.actionBtnOutline} ${styles.wiggle}`}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Mail size={18} />
            <span>Gửi tin nhắn cho shop</span>
        </a>
    );
}