import axios from 'axios';
import styles from "../inventory.module.css"

export default function DeleteItem({fileId, setReset}) {

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/item/delete/${fileId}`);

            setReset((prev) => !prev)

            alert("Thành công!");

        } catch (err) {

            console.error('Delete failed', err);

            alert("Xóa item thất bại");

        }
    };

    return (
        <form className={styles.form}>
            <button onClick={handleSubmit} className={styles.deleteButton}>
                Xóa Item
            </button>
        </form>
    );
}