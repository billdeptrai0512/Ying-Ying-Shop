import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useFolder } from '../public/folderContext';
import styles from "./form.module.css"

export default function DeleteFile() {

    const { refreshFolders } = useFolder()

    const { fileId } = useParams()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.delete(`http://localhost:3000/file/delete/?fileId=${fileId}`);

            console.log(response.data)

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