import { useState } from 'react';
import axios from 'axios';
import styles from "../order.module.css";

export default function CreateExpense({setReset}) {
    const [expense, setExpense] = useState({
        name: '',
        total: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/expense/create`, {
                name: expense.name,
                total: expense.total,
            });

            alert("Thành công!");

            setReset((prev) => !prev)

        } catch (err) {
            console.error('Upload failed', err);
            alert("Tạo item thất bại");
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
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    id="total"
                    name="total"
                    placeholder="Số tiền"
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit">Thêm chi phí</button>
        </form>
    );
}
