import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../inventory.module.css"
export default function CreateItem({folderId, setReset}) {

    const [formData, setFormData] = useState({
        amount: '',
        total: '',
        type: 'top',
        z_index: '2',
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

        console.log(image, demoImage)

        try {

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/file/create/${folderId}`, data, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            });

            setReset((prev) => !prev)

            alert("Thành công!");

        } catch (err) {

            console.error('Upload failed', err);

            alert("Tạo item thất bại");

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

            console.log(formData.z_index)
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

    };

    useEffect(() => {

        if (folderId === 2) {
            setFormData(prev => ({ ...prev, ["type"]: 'top' }));
            setFormData(prev => ({ ...prev, ['z_index']: '2' }));
        } else if (folderId === 3) {
            setFormData(prev => ({ ...prev, ["type"]: 'short' }));
            setFormData(prev => ({ ...prev, ['z_index']: '3' }));
        } else if (folderId === 4) {
            setFormData(prev => ({ ...prev, ["type"]: 'long' }));
            setFormData(prev => ({ ...prev, ['z_index']: '1' }));
        } else if (folderId === 5) {
            setFormData(prev => ({ ...prev, ["type"]: 'sweater' }));
            setFormData(prev => ({ ...prev, ['z_index']: '4' }));
        } else if (folderId === 6) {
            setFormData(prev => ({ ...prev, ["type"]: 'gakuran' }));
            setFormData(prev => ({ ...prev, ['z_index']: '5' }));
        } else if (folderId === 7) {
            setFormData(prev => ({ ...prev, ["type"]: 'blazer' }));
            setFormData(prev => ({ ...prev, ['z_index']: '5' }));
        } else if (folderId === 8) {
            return
        }

    }, [folderId])

    return (
        <form onSubmit={handleSubmit} className={styles.sizeForm}>
            <div style={{display: "flex", justifyContent: "space-around"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "2em"}}>
                    <label htmlFor="image">Image</label>
                    {image && (
                        <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        style={{ width: '200px', objectFit: 'cover', border: '1px solid #ccc' }}
                        />
                    )}
                    <input type="file" name="image" onChange={(e) =>  setImage(e.target.files[0])}/>
                </div>

                <div style={{display: "flex", flexDirection: "column", gap: "2em"}}>
                    <label htmlFor="demo_image">Demo Image</label>
                    {demoImage && (
                        <img
                        src={URL.createObjectURL(demoImage)}
                        alt="Preview"
                        style={{ width: '200px', objectFit: 'cover', border: '1px solid #ccc' }}
                        />
                    )}
                    <input type="file" name="demo_image" onChange={(e) => setDemoImage(e.target.files[0])} />
                </div>
            </div>

            {folderId === 8 && (
                <>
                    <label htmlFor="image">Loại</label>
                    <select name="type" value={formData.type+"-"+formData.z_index} onChange={handleChange}>
                        <option value="bow-5">Bow</option>
                        <option value="tie-3">Tie</option>
                        <option value="bag-6">Bag</option>
                    </select>
                </>

            )}

            <label htmlFor="image">Giá tiền</label>
            <input type="number" name="total" value={formData.total} onChange={handleChange} />

            <label htmlFor="image">Số lượng</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} />


            {formData.type !== '' &&
                !['bow', 'tie', 'bag'].includes(formData.type) && (
                    <div className={styles.checkboxGroup}>
                        {(formData.type === 'gakuran'
                            ? ['145A', '150A', '160A', '165A', '170A', '170B', '175A', '180A']
                            : ['S', 'M', 'L', 'XL']
                        ).map((size) => (
                            <label key={size} className={styles.checkboxItem}>
                                <input
                                    type="checkbox"
                                    value={size}
                                    checked={formData.sizes.includes(size)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setFormData((prev) => ({
                                            ...prev,
                                            sizes: checked
                                                ? [...prev.sizes, size]
                                                : prev.sizes.filter((s) => s !== size)
                                        }));
                                    }}
                                />
                                {size}
                            </label>
                        ))}
                    </div>
                )}

            <div className={styles.action} >
                <button type="submit" className={styles.saveButton} >
                    Tạo item
                </button>
            </div>
        </form>
    );
}