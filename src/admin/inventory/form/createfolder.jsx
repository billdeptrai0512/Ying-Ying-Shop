import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFolder } from '../../../public/inventoryContext';
import { Link } from 'react-router-dom';
import styles from "../inventory.module.css"


export default function CreateFolder() {

    const { refreshFolders } = useFolder()
    const navigate = useNavigate()

    const [folderData, setFolderData] = useState({
        name: '',
        section: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/inventory/create`, {
                name: folderData.name,
                section: folderData.section
            });

            refreshFolders()

            navigate('/')

        } catch (err) {

            console.error('Upload failed', err);

        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFolderData(prev => ({ ...prev, [name]: value }));

    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input type="text" name="name" placeholder="Áo sơ mi"onChange={handleChange} />
                <select name="section" onChange={handleChange}>
                    <option value="top">top</option>
                    <option value="bottom">bottom</option>
                    <option value="sweater">sweater</option>
                    <option value="jacket">jacket</option>
                    <option value="extra">extra</option>
                </select>
                <div className={styles.action}>
                    <button type="submit">Upload</button>
                    <button> <Link to="/" >Cancel </Link> </button>
                    
                </div>
            </form>
        </div> 
            
    );
}