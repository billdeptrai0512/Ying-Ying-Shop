import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useFolder } from '../public/folderContext';
import styles from "./form.module.css"
import { Link } from 'react-router-dom';

export default function FileUpload() {

    const { refreshFolders } = useFolder()
    const { folderId } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        amount: '',
        total: '',
        type: 'top',
        sizes: [],
        z_index: '1',
    })

    const [image, setImage] = useState(null);
    const [demoImage, setDemoImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(folderId)

        const data = new FormData();
        data.append('folderId', folderId);
        data.append('image', image);
        data.append('demo_image', demoImage);
        data.append('amount', formData.amount);
        data.append('total', formData.total);
        data.append('type', formData.type);
        data.append('z_index', formData.z_index);

        formData.sizes.forEach(size => {
            data.append('sizes[]', size);
        });

        try {

            await axios.post('http://localhost:3000/file/upload', data, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            });

            refreshFolders()

            navigate('/')

        } catch (err) {

            console.error('Upload failed', err);

        }
    };

    const handleChange = (e) => {
        const { name, value, selectedOptions } = e.target;
        if (name === 'sizes[]') {
            const values = Array.from(selectedOptions).map(opt => opt.value);
            setFormData(prev => ({ ...prev, sizes: values }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input type="file" name="image" onChange={(e) => setImage(e.target.files[0])} />
            <input type="file" name="demo_image" onChange={(e) => setDemoImage(e.target.files[0])} />
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
            <input type="number" name="total" value={formData.total} onChange={handleChange} />
            <select name="type" value={formData.type} onChange={handleChange}>
                <option value="top">Áo sơ mi</option>
                <option value="long">Quần dài</option>
                <option value="short">Váy</option>
                <option value="gakuran">Gakuran</option>
                <option value="blazer">Blazer</option>
                <option value="tie">Tie</option>
                <option value="bow">Bow</option>
                <option value="bag">Bag</option>
            </select>
            <select name="sizes[]" multiple size="4" onChange={handleChange}>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
            </select>
            <select name="z_index" value={formData.z_index} onChange={handleChange}>
                <option value="1">1 - Quần</option>
                <option value="2">2 - Áo sơ mi</option>
                <option value="3">3 - Váy</option>
                <option value="4">4 - Áo len</option>
                <option value="5">5 - Jacket</option>
                <option value="6">6 - Phụ Kiện</option>
            </select>
            <button type="submit">Upload</button>
            <Link to="/" >Cancel </Link>
        </form>
        
    );
}