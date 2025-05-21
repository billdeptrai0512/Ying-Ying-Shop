import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css"
import axios from "axios";
import Total from "./total";

export default function FormPlaceOrder({cart, selectedOutFit}) {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        date: '',
        name: '',
        phone: '',
        email: '',
        adress: '',
        outfit: [],
        total: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault();


        const data = new FormData();
        data.append('amount', formData.amount);
        data.append('total', formData.total);
        data.append('type', formData.type);
        data.append('z_index', formData.z_index);

        formData.sizes.forEach(size => {
            data.append('sizes[]', size);
        });

        try {

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/file/upload/${folderId}`, data, {
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

    // so the total and the count here is the count of all item in cart and so do total
    // TODO : implement express validator for this form
    
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.details}>
                <div>
                    <label htmlFor="date">Ngày thuê:</label>
                    <div className={styles.date}>
                        <input type="number" name="date" placeholder="Ngày" value={formData.amount} onChange={handleChange} />
                        <input type="number" name="month" placeholder="Tháng" value={formData.amount} onChange={handleChange} />
                        <input type="number" name="year" placeholder="Năm" value={formData.amount} onChange={handleChange} />
                    </div>
                </div>

                <input className={styles.name} type="text" name="name" placeholder="Tên:" value={formData.total} onChange={handleChange} />
                <input className={styles.phone} type="number" name="phone" placeholder="Số điện thoại:" value={formData.total} onChange={handleChange} />
                <input className={styles.email} type="email" name="email" placeholder="Email:" value={formData.total} onChange={handleChange} />
                <textarea className={styles.address} name="address" placeholder="Địa chỉ:" value={formData.total} onChange={handleChange} rows={6} />
            </div>
            <div className={styles.submit}>
                <Total cart={cart} selectedOutFit={selectedOutFit}></Total>
                <button className={styles.back} onClick={() => navigate('/cart')}>TRỞ VỀ</button> 
                <button className={styles.cta} type="submit">ĐẶT CỌC</button>
            </div>
            {/* <Link to="/" >Cancel </Link> */}
        </form>
    )
}