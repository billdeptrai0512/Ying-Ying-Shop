import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css"
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import Total from "./total";

export default function FormPlaceOrder({cart, selectedOutFit}) {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        date: '',
        month: '',
        year: '',
        name: '',
        phone: '', //encrypt phone - email - address
        email: '',
        address: '',
    })

    const [errors, setErrors] = useState([]); // State to store validation errors

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); // Clear previous errors

        const data = new FormData();

        data.append('date', formData.date);
        data.append('month', formData.month);
        data.append('year', formData.year);
        data.append('name', formData.name);
        data.append('phone', formData.phone);
        data.append('address', formData.address);
        data.append('total', cart.reduce((acc, item) => acc + item.total, 0)); // total price of all items in cart

        const allItem = []

        cart.forEach(outfit => {
            Object.entries(outfit)
                .filter(([key]) => key !== "total")
                .forEach(([section, value]) => {
                    //if section = extra
                    if (section === 'extra') {
                        const bow = value.bow
                        const bag = value.bag

                        if (bow.item) {

                            const item = bow.item

                            const data = {
                                id: item.id,
                            }

                            allItem.push(data)
                        }

                        if (bag.item) {

                            const item = bag.item
                            
                            const data = {
                                id: item.id,
                            }

                            allItem.push(data)
                        }

                    }

                    if  (value.item) {
                        
                        const item = value.item

                        const data = {
                            id: item.id,
                            size: value.size,
                        }

                        allItem.push(data)

                    }
                });
        });

        data.append('cart', JSON.stringify(allItem)); // Serialize the array to JSON

        try {

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/place-order/create`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response.data)

            navigate(`/cart/checkout/${response.data.id}`)

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
        const { name, value, selectedOptions } = e.target;
        if (name === 'sizes[]') {
            const values = Array.from(selectedOptions).map(opt => opt.value);
            setFormData(prev => ({ ...prev, sizes: values }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const getErrorForField = (fieldName) => {
        const error = errors.find((err) => err.path === fieldName);
        return error ? error.msg : null;
    };

    // so the total and the count here is the count of all item in cart and so do total

    const isDesktop = useMediaQuery({ query: '(min-width: 1400px)'})
    
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.details}>
                <div>
                    <label htmlFor="date">Ngày thuê:</label>
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
            <div className={styles.submit}>
                <Total cart={cart} selectedOutFit={selectedOutFit}></Total> 
                <button className={styles.back} onClick={() => navigate(isDesktop ? '/' : '/cart')}>TRỞ VỀ</button> 
                <button className={styles.cta} type="submit">THANH TOÁN</button>
            </div>
            {/* <Link to="/" >Cancel </Link> */}
        </form>
    )
}