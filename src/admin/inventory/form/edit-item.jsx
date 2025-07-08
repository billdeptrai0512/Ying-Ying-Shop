import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../inventory.module.css"
import DeleteItem from './delete-item';


export default function EditItem({selectedItem, setReset}) {

    const [image, setImage] = useState(null);
    const [demoImage, setDemoImage] = useState([]);
    const [itemInformation, setItemInformation] = useState({
        amount: '',
        total: '',
        type: '',
        z_index: '',
        sizes: [],
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        
        if (demoImage && demoImage.length > 0) {
            demoImage.forEach((img) => {
                data.append(`demo_image`, img);
            });
        }

        data.append('image', image);
        data.append('amount', itemInformation.amount);
        data.append('total', itemInformation.total);
        data.append('type', itemInformation.type);
        data.append('z_index', itemInformation.z_index);
        console.log(demoImage)

        itemInformation.sizes.forEach(size => {
            data.append('sizes[]', size);
        });

        try {

            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/item/edit/${selectedItem.id}`, data, {
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

        setItemInformation(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {

        if (!selectedItem) return;

        const item = {
            amount: selectedItem.amount || '',
            total: selectedItem.total || '',
            type: selectedItem.type || '',
            z_index: selectedItem.z_index || '',
            sizes: selectedItem.sizes || [],
        }

        setItemInformation(item);

    }, [selectedItem]);

    return (
        <form onSubmit={handleSubmit} className={styles.sizeForm}>
            <div style={{display: "flex", justifyContent: "space-around"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "2em"}}>
                    {selectedItem.image && (
                        <img
                            src={selectedItem.image}
                            alt="Preview"
                            style={{ width: '200px', objectFit: 'cover', border: '1px solid #ccc' }}
                        />
                    )}

                    <label htmlFor="inventory_image">Inventory Image</label>
                    <input type="file" name="image" 
                        onChange={(e) =>  {
                            const file = e.target.files[0];
                            if (file) {
                                setImage(file);
                            }}}
                        />
                </div>

                <div style={{display: "flex", flexDirection: "column", gap: "2em"}}>
                    {selectedItem.demo_image && selectedItem.demo_image.map((img, index) => (
                        <img
                        key={index}
                        src={img}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '200px', objectFit: 'cover', border: '1px solid #ccc' }}
                        />
                    ))}
                    <label htmlFor="demo_image">Demo Image</label>
                    <input type="file" name="demo_image" multiple onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setDemoImage(prev => [...prev, ...files])
                        }} 
                    />

                     <input type="file" name="demo_image" multiple onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setDemoImage(prev => [...prev, ...files])
                        }} 
                    />
                </div>

            </div>

            <label htmlFor="total">Giá tiền</label>
            <input
                type="text"
                name="total"
                value={itemInformation.total}
                onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters
                    setItemInformation((prev) => ({ ...prev, total: rawValue })); // Update formData with numeric value
                }}
                onBlur={(e) => {
                    // Format the value when the input loses focus
                    const formattedValue = itemInformation.total ? `${Number(itemInformation.total).toLocaleString()}đ` : '';
                    e.target.value = formattedValue;
                }}
                onFocus={(e) => {
                    // Remove formatting when the input gains focus
                    e.target.value = itemInformation.total;
                }}
            />

            <label htmlFor="image">Số lượng</label>
            <input type="number" name="amount" value={itemInformation.amount} onChange={handleChange} />

            {['bow', 'tie', 'bag'].includes(selectedItem.type)  && (
                <>
                    <label htmlFor="image">Loại</label>
                    <select name="type" value={itemInformation.type+"-"+itemInformation.z_index} onChange={handleChange}>
                        <option value="bow-5">Bow</option>
                        <option value="tie-3">Tie</option>
                        <option value="bag-6">Bag</option>
                    </select>
                </>

            )}

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
                                checked={itemInformation.sizes.includes(size)}
                                onChange={(e) => {
                                const checked = e.target.checked;
                                setItemInformation((prev) => ({
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


            <div className={styles.action}>
                <button type="submit" className={styles.saveButton} >
                    Lưu thay đổi
                </button>
                <DeleteItem fileId={selectedItem.id} setReset={setReset}/>
            </div>  
            
        </form>  
    );
}