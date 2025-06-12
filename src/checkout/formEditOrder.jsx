import { useState } from "react";
import styles from "./checkout.module.css"
import axios from "axios";
import Total from "./total";

export default function FormEditOrder({ order, formId, setEditMode, setUpdateOrder }) {

    const [errors, setErrors] = useState([]); // State to store validation errors
    const [formData, setFormData] = useState({
        date: new Date(order.date).toLocaleDateString('vi-VN', {day: '2-digit'}) || '',
        month: new Date(order.date).toLocaleDateString('vi-VN', {month: '2-digit'}) || '',
        year: new Date(order.date).toLocaleDateString('vi-VN', {year: 'numeric'}) || '',
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
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/place-order/edit/${order.id}`, data, {
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
        <form id={formId} className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.details} style={{ padding: "0 1em" }}>
                <div>
                    <div className={styles.date}>
                        <input type="number" name="date" placeholder="Ngày" value={formData.date} onChange={handleChange} />
                        <input type="number" name="month" placeholder="Tháng" value={formData.month} onChange={handleChange} />
                        <input type="number" name="year" placeholder="Năm" value={formData.year} onChange={handleChange} />
                    </div>
                    {(getErrorForField("date") || getErrorForField("month") || getErrorForField("year")) && (
                        <p className={styles.error}>
                            {getErrorForField("date") || getErrorForField("month") || getErrorForField("year")}
                        </p>
                    )}
                </div>
                <div>
                    {getErrorForField("name") && (<p className={styles.error}>{getErrorForField("name")}</p>)}
                    <input className={styles.name} type="text" name="name" placeholder="Tên:" value={formData.name} onChange={handleChange} />
                </div>

                <div>
                    {getErrorForField("phone") && (<p className={styles.error}>{getErrorForField("phone")}</p>)}
                    <input className={styles.phone} type="number" name="phone" placeholder="Số điện thoại:" value={formData.phone} onChange={handleChange} />
                </div>

                <div>
                    {getErrorForField("address") && (<p className={styles.error}>{getErrorForField("address")}</p>)}
                    <textarea className={styles.address} name="address" placeholder="Địa chỉ:" value={formData.address} onChange={handleChange} rows={6} />
                </div>
            </div>
        </form>
    );
}
