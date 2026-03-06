import { X } from 'lucide-react';
import styles from '../checkout.module.css';

export default function DenyButton({ setEditMode }) {
    return (
        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setEditMode(false)}>
            <X size={18} />
            <span>Hủy</span>
        </button>
    );
}