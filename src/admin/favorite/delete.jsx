import axios from 'axios';
import styles from "./outfit.module.css"

export default function DeleteButton({id, setReset}) {

    const handleSubmit = async (e) => {

        e.preventDefault();

        console.log(id)

        try {

            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/favorite/remove/${id}`);

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