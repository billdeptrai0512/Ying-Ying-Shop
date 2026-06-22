import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../public/cartContext";
import styles from "../cart.module.css"
import axios from "axios";

export default function FormPlaceOrder({ formId, setSubmitting }) {

    const { cart } = useCart()
    const navigate = useNavigate()

    const topRef = useRef(null)
    const [errors, setErrors] = useState([]); // State to store validation errors

    // Surface errors where the user is looking: the submit button lives in a
    // separate section, so scroll the form's notice into view on failure.
    const showErrors = (errs) => {
        setErrors(errs);
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    const [formData, setFormData] = useState({
        date: '',
        month: '',
        year: '',
        name: '',
        phone: '', //encrypt phone - email - address
        address: '',
    })

    const handleSubmit = async (e) => {

        e.preventDefault();
        setErrors([]); // Clear previous errors

        // Validate at the boundary before hitting the backend (which also validates).
        const clientErrors = validateOrder(formData, cart);
        if (clientErrors.length > 0) {
            showErrors(clientErrors);
            return;
        }

        setSubmitting(true);

        const data = new FormData();

        data.append('date', formData.date);
        data.append('month', formData.month);
        data.append('year', formData.year);
        data.append('name', formData.name.toUpperCase());
        data.append('address', formData.address.toUpperCase());
        data.append('phone', formData.phone);
        data.append('total', cart.reduce((acc, item) => acc + item.total, 0)); // total price of all items in cart
        data.append('cart', JSON.stringify(getAllItem(cart))); // Serialize the array to JSON

        try {

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/order/place-order/create`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            navigate(`/cart/checkout/${response.data.id}`)

        } catch (err) {
            if (err.response && err.response.status === 400) {
                showErrors(err.response.data.errors); // Set validation errors from the backend
            } else {
                console.error("Upload failed", err);
                showErrors([{ path: "name", msg: "Tạo đơn thất bại, vui lòng thử lại." }]);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getErrorForField = (fieldName) => {
        const error = errors.find((err) => err.path === fieldName);
        return error ? error.msg : null;
    };

    return (
        <form id={formId} className={styles.form} onSubmit={handleSubmit}  >
            <div className={styles.details}>
                <p ref={topRef} className={styles.error} style={{ display: errors.length ? "block" : "none" }}>
                    Vui lòng kiểm tra lại thông tin đơn hàng.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="date">Chọn ngày thuê:</label>
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
                    <input className={styles.phone} type="tel" inputMode="numeric" name="phone" placeholder="Số điện thoại:" value={formData.phone} onChange={handleChange} />
                </div>

                <div>
                    {getErrorForField("address") && (<p className={styles.error}>{getErrorForField("address")}</p>)}
                    <textarea className={styles.address} name="address" placeholder="Địa chỉ:" value={formData.address} onChange={handleChange} rows={6} />
                </div>
            </div>
        </form>
    )
}

// Client-side order validation. Returns express-validator-shaped errors
// ({ path, msg }) so the existing per-field error display renders them.
// eslint-disable-next-line react-refresh/only-export-components
export function validateOrder(formData, cart) {
    const errors = [];
    const { date, month, year, name, phone, address } = formData;

    if (!date || !month || !year) {
        errors.push({ path: "date", msg: "Vui lòng nhập đầy đủ ngày, tháng, năm thuê." });
    } else {
        const d = Number(date), m = Number(month), y = Number(year);
        const dt = new Date(y, m - 1, d);
        const realDate = dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
        if (!realDate) errors.push({ path: "date", msg: "Ngày thuê không hợp lệ." });
    }

    if (!name?.trim()) errors.push({ path: "name", msg: "Vui lòng nhập tên." });

    if (!/^\d{9,11}$/.test(String(phone))) {
        errors.push({ path: "phone", msg: "Số điện thoại không hợp lệ (9–11 chữ số)." });
    }

    if (!address?.trim()) errors.push({ path: "address", msg: "Vui lòng nhập địa chỉ." });

    if (!cart || cart.length === 0) {
        errors.push({ path: "name", msg: "Giỏ hàng đang trống." });
    }

    return errors;
}

function getAllItem(cart) {

    const allItem = []

    cart.forEach(outfit => {
        Object.entries(outfit)
            .filter(([key]) => key !== "total")
            .forEach(([section, value]) => {
                //if section = extra
                if (section === 'extra') {
                    const neck = value.neck
                    const bag = value.bag

                    if (neck.item) {

                        const item = neck.item

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

                if (value.item) {

                    const item = value.item

                    const data = {
                        id: item.id,
                        size: value.size,
                    }

                    allItem.push(data)

                }
            });
    });

    return allItem;
}