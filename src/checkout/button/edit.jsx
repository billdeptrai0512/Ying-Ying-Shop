import { Pencil } from 'lucide-react';
import styles from '../checkout.module.css';

export default function EditButton({ setEditMode }) {
    return (
        <button className={`${styles.actionBtn} ${styles.actionBtnOutline}`} onClick={() => setEditMode(true)}>
            <Pencil size={18} />
            <span>Tùy chỉnh</span>
        </button>
    );
}