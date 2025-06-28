import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../inventory.module.css"
import DeleteItem from './delete-item';


export default function EditItem({selectedItem, setReset}) {

    const [demoImage, setDemoImage] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        total: '',
        type: '',
        z_index: '',
        sizes: [],
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('demo_image', demoImage);
        data.append('amount', formData.amount);
        data.append('total', formData.total);

        formData.sizes.forEach(size => {
            data.append('sizes[]', size);
        });

        try {

            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/file/edit/${selectedItem.id}`, data, {
                headers: {
                    'Content-Type' : 'multipart/form-data',
                    "ngrok-skip-browser-warning": "true"
                }
            })

            setReset((prev) => !prev)

            alert("Thành công!");

        } catch (err) {

            console.error('Upload failed', err);

            alert("Có lỗi xảy ra khi cập nhật.");

        }

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {

        if (selectedItem) {
            setFormData({
                amount: selectedItem.amount || '',
                total: selectedItem.total || '',
                type: selectedItem.type || '',
                z_index: selectedItem.z_index || '',
                sizes: selectedItem.sizes || [],
            });
        }

    }, [selectedItem]);

    return (
        <form onSubmit={handleSubmit} className={styles.sizeForm}>
            <label htmlFor="demo_image">Demo Image</label>
            <div>
                <img
                    src={selectedItem.demo_image}
                    alt={`Item ${selectedItem.id}`}
                    className={styles.itemImage}
                />
                <input type="file" name="demo_image" onChange={(e) => setDemoImage(e.target.files[0])} />
            </div>
            <label htmlFor="image">Giá tiền</label>
            <input
                type="text"
                name="total"
                value={formData.total}
                onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters
                    setFormData((prev) => ({ ...prev, total: rawValue })); // Update formData with numeric value
                }}
                onBlur={(e) => {
                    // Format the value when the input loses focus
                    const formattedValue = formData.total ? `${Number(formData.total).toLocaleString()}đ` : '';
                    e.target.value = formattedValue;
                }}
                onFocus={(e) => {
                    // Remove formatting when the input gains focus
                    e.target.value = formData.total;
                }}
            />

            <label htmlFor="image">Số lượng</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} />

            {['bow', 'tie', 'bag'].includes(selectedItem.type)  && (
                <>
                    <label htmlFor="image">Loại</label>
                    <select name="type" value={formData.type+"-"+formData.z_index} onChange={handleChange}>
                        <option value="bow-5">Bow</option>
                        <option value="tie-3">Tie</option>
                        <option value="bag-6">Bag</option>
                    </select>
                </>

            )}

            <div className={styles.checkboxGroup}>
                {
                    !['bow', 'tie', 'bag'].includes(selectedItem.type) && (
                        <div className={styles.checkboxGroup}>
                        {(selectedItem.type === 'gakuran'
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
                    )
                }   
            </div>

            <div className={styles.action}>
                <button type="submit" className={styles.saveButton} >
                    Lưu thay đổi
                </button>
                <DeleteItem fileId={selectedItem.id} setReset={setReset}/>
            </div>  
            
        </form>  
    );
}