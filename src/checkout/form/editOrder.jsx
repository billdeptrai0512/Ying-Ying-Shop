import { useState } from "react";
import styles from "../checkout.module.css"
import axios from "axios";
import Total from "../total";

export default function FormEditOrder({ order, formId, setEditMode, setUpdateOrder }) {

    const [errors, setErrors] = useState([]); // State to store validation errors
    const [formData, setFormData] = useState({
        date: new Date(order.date).toLocaleDateString('vi-VN', { day: '2-digit' }) || '',
        month: new Date(order.date).toLocaleDateString('vi-VN', { month: '2-digit' }) || '',
        year: new Date(order.date).toLocaleDateString('vi-VN', { year: 'numeric' }) || '',
        name: order.name || '',
        phone: order.phone || '', // encrypt phone - email - address
        address: order.address || '',
    });

    const handleSubmit = async (e) => {

        e.preventDefault();
        setErrors([]); // Clear previous errors

        const data = new FormData();

        data.append('date', formData.date);
        data.append('month', formData.month);
        data.append('year', formData.year);
        data.append('name', formData.name.toUpperCase());
        data.append('address', formData.address.toUpperCase());
        data.append('phone', formData.phone);

        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/order/place-order/edit/${order.id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response.data);

            setEditMode(false)

            setUpdateOrder((prev => !prev))

        } catch (err) {
            if (err.response && err.response.status === 400) {
                setErrors(err.response.data.errors); // Set validation errors from the backend
                console.log(err.response.data.errors);
            } else {
                console.error("Upload failed", err);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const getErrorForField = (fieldName) => {
        const error = errors.find((err) => err.path === fieldName);
        return error ? error.msg : null;
    };

    return (
        <form id={formId} className={styles.customerInfo} onSubmit={handleSubmit} style={{ gap: '0.8rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4em' }}>
                <p className={styles.copyable} style={{ margin: 0 }}>Ngày thuê:</p>
                <div style={{ display: 'flex', gap: '0.4em', alignItems: 'center' }}>
                    <input className={styles.editInput} style={{ flex: 1, textAlign: 'center' }} type="number" name="date" placeholder="DD" value={formData.date} onChange={handleChange} />
                    <span style={{ color: '#331D1C', fontWeight: 600 }}>/</span>
                    <input className={styles.editInput} style={{ flex: 1, textAlign: 'center' }} type="number" name="month" placeholder="MM" value={formData.month} onChange={handleChange} />
                    <span style={{ color: '#331D1C', fontWeight: 600 }}>/</span>
                    <input className={styles.editInput} style={{ flex: 1.2, textAlign: 'center' }} type="number" name="year" placeholder="YYYY" value={formData.year} onChange={handleChange} />
                </div>
                {(getErrorForField("date") || getErrorForField("month") || getErrorForField("year")) && (
                    <p className={styles.error} style={{ margin: 0 }}>
                        {getErrorForField("date") || getErrorForField("month") || getErrorForField("year")}
                    </p>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4em' }}>
                <p className={styles.copyable} style={{ margin: 0 }}>Họ và tên:</p>
                <input className={styles.editInput} type="text" name="name" placeholder="Tên" value={formData.name} onChange={handleChange} />
                {getErrorForField("name") && (<p className={styles.error} style={{ margin: 0 }}>{getErrorForField("name")}</p>)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4em' }}>
                <p className={styles.copyable} style={{ margin: 0 }}>Số điện thoại:</p>
                <input className={styles.editInput} type="number" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} />
                {getErrorForField("phone") && (<p className={styles.error} style={{ margin: 0 }}>{getErrorForField("phone")}</p>)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4em' }}>
                <p className={styles.copyable} style={{ margin: 0 }}>Địa chỉ:</p>
                <textarea className={`${styles.editInput} ${styles.editInputArea}`} name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} />
                {getErrorForField("address") && (<p className={styles.error} style={{ margin: 0 }}>{getErrorForField("address")}</p>)}
            </div>
        </form>
    );
}
