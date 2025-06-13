
import { Check } from 'lucide-react';
import styles from '../checkout.module.css';

export default function SaveButton() {
    
    return (
        
        <div style={{ textAlign: "center", margin: "1rem" }}>
            <button style={{backgroundColor: "#331D1C", width: "fit-content", margin: "0 auto", padding: "0.5em", display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "50%", marginBottom:"0.5em", cursor: "pointer"}}
                type='submit' form='formEditOrder'
            >
                    <Check size={20} color="#FFFFFF"  />
            </button>
            <p className={styles.copyable}>
                Lưu thông tin
            </p>
        </div>

    );
    


}