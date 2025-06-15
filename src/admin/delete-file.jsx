import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useFolder } from '../public/folderContext';
import styles from "./admin.module.css"

export default function DeleteFile() {

    const { refreshFolders } = useFolder()

    const { fileId } = useParams()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/file/delete/?fileId=${fileId}`);

            refreshFolders()

            navigate('/')

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