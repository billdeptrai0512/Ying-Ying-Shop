import { useState } from 'react';
import axios from 'axios';
import styles from "../order.module.css";

export default function EditExpense({id, name, total, setShowEditModal, setReset}) {
    const [expense, setExpense] = useState({
        name: name || '',
        total: total || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/expense/edit/${id}`, {
                name: expense.name,
                total: expense.total,
            });

            alert("Thành công!");

            setReset((prev) => !prev)

        } catch (err) {
            console.error('Upload failed', err);
            alert("Edit item thất bại");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpense(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className={styles.sizeForm}>
            <div className={styles.date}>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Tên chi phí"
                    value={expense.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    id="total"
                    name="total"
                    placeholder="Số tiền"
                    value={expense.total}
                    onChange={handleChange}
                    required
                />
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
                <button type="submit" className={styles.saveButton}>Chỉnh sữa</button>
                <button className={styles.deleteButton} onClick={() => setShowEditModal(false)}>Hủy Bỏ</button>
            </div>
        </form>
    );
}
