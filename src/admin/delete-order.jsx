import axios from 'axios';
import styles from "./admin.module.css"

export default function DeleteOrder({orderId, setRefresh}) {

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/order/delete/${orderId}`);

            setRefresh((prev => !prev))

        } catch (err) {

            console.error('Delete failed', err);

        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <button type="submit">Delete</button>
        </form>
    );
}