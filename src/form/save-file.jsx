import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useFolder } from '../public/folderContext';
import styles from "./form.module.css"
import { Link } from 'react-router-dom';
export default function SaveFile() {

    const { refreshFolders } = useFolder()
    const { fileId } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        amount: '',
        total: '',
        type: '',
        z_index: '',
        sizes: [],
    })

    const [image, setImage] = useState(null);
    const [demoImage, setDemoImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        if (image) data.append('image', image);
        if (demoImage) data.append('demo_image', demoImage);
        data.append('amount', formData.amount);
        data.append('total', formData.total);
        data.append('type', formData.type);
        data.append('z_index', formData.z_index);

        formData.sizes.forEach(size => {
            data.append('sizes[]', size);
        });

        console.log(image, demoImage, fileId)

        try {

            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/file/edit/${fileId}`, data, {
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
        } else if (name === 'type') {
            const type = value.split('-')[0]
            const z_index = value.split('-')[1]
            setFormData(prev => ({ ...prev, [name]: type }));
            setFormData(prev => ({ ...prev, ['z_index']: z_index }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

    };

    useEffect(() => {

        const fetchFile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/file/${fileId}`, {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    }
                });
                const data = response.data[0];

                setFormData({
                    amount: data.amount || '',
                    total: data.total || '',
                    type: data.type || '',
                    sizes: data.sizes || [],
                    z_index: data.z_index?.toString() || '',
                });

            } catch (err) {
                console.error("fetch folder: " + err);
            }
        };
    
        fetchFile();
    }, [fileId]);

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="image">Image</label>
            <input type="file" name="image" onChange={(e) => setImage(e.target.files[0])} />
            <label htmlFor="demo_image">Demo Image</label>
            <input type="file" name="demo_image" onChange={(e) => setDemoImage(e.target.files[0])} />
            <label htmlFor="image">Số lượng</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
            <label htmlFor="image">Giá tiền</label>
            <input type="number" name="total" value={formData.total} onChange={handleChange} />
            <select name="type" value={formData.type+"-"+formData.z_index} onChange={handleChange}>
                <option value="top-2">Áo sơ mi</option>
                <option value="long-1">Quần dài</option>
                <option value="short-3">Váy</option>
                <option value="sweater-4">Sweater</option>
                <option value="gakuran-5">Gakuran</option>
                <option value="blazer-5">Blazer</option>
                <option value="bow-5">Bow</option>
                <option value="tie-3">Tie</option>
                <option value="bag-6">Bag</option>
            </select>
            <select name="sizes[]" multiple size="4" onChange={handleChange} style={{ height: '13em' }}>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                {/*  */}
                <option value="145A">145A</option>
                <option value="150A">150A</option>
                <option value="160A">160A</option>
                <option value="170A">170A</option>
                <option value="170B">170B</option>
                <option value="175A">175A</option>
            </select>
            <button type="submit">Save</button>
        </form>
    );
}