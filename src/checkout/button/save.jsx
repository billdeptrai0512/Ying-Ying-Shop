import { Check } from 'lucide-react';
import styles from '../checkout.module.css';

export default function SaveButton() {
    return (
        <button className={styles.actionBtn} type="submit" form="formEditOrder">
            <Check size={18} />
            <span>Lưu</span>
        </button>
    );
}