import { useState, useEffect } from "react";
import styles from "./cart.module.css"

export default function Total({cart, selectedOutFit}) {

    const [total, setTotal] = useState(null)
    const [count, setCount] = useState(null)
    const [formData, setFormData] = useState({
        date: '',
        name: '',
        phone: '',
        email: '',
        adress: '',
        outfit: [],
        total: '',
    })

    const formatCurrency = (value) => {
        if (!value) value = 0
        const intValue = Math.floor(value);
        return intValue.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + "đ";
    };

    const analyzeInventory = (cart) => {
        let itemCount = 0;
        let totalSum = 0;

        // console.log(data)
        const countItems = (section) => {
          if (section && typeof section === 'object') {
              if ('item' in section) {
                  if (section.item !== null) {
                      itemCount += 1;
                  }
              }
  
              // Recursively check nested objects
              Object.values(section).forEach(value => {
                  if (typeof value === 'object') {
                      countItems(value);
                  }
              });
          }
        };
      
        cart.forEach(outfit => {
          Object.values(outfit).forEach(section => {
              countItems(section);
          });
  
          if (typeof outfit.total === 'number') {
              totalSum += outfit.total;
          }
      });
      
        return { itemCount, totalSum };
    };

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

    useEffect(() => {
        if (cart) {
            const { itemCount, totalSum } = analyzeInventory(cart);
            setCount(itemCount);
            setTotal(totalSum);
        }
    }, [cart, selectedOutFit]);

    // so the total and the count here is the count of all item in cart and so do total

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
                <textarea className={styles.address} name="address" placeholder="Địa chỉ:" value={formData.total} onChange={handleChange} rows={8} />
            </div>
            <div className={styles.submit}>
                <div className={styles.total}>
                    <p>Tổng ({count})</p>
                    <h3 className={styles.number}>{formatCurrency(total)}</h3>
                </div>
                <button className={styles.cta} type="submit">ĐẶT CỌC</button>
            </div>
            {/* <Link to="/" >Cancel </Link> */}
        </form>
    )
}