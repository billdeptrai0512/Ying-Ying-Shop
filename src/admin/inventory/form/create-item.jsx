import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../inventory.module.css"
export default function CreateItem({folderId, setReset}) {

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
        if (image) data.append('image', image);
        //image actually don't need z_index
        if (demoImage && demoImage.length > 0) {
            demoImage.forEach((img) => {
                data.append(`demo_image`, img);
            });
        }
        // image become object with each own z_index
        // only the demo_image need z_index

        data.append('amount', itemInformation.amount);
        data.append('total', itemInformation.total);
        data.append('type', itemInformation.type);
        data.append('z_index', itemInformation.z_index);

        itemInformation.sizes.forEach(size => {
            data.append('sizes[]', size);
        });

        try {

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/item/create/${folderId}`, data, {
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
            setItemInformation(prev => ({ ...prev, sizes: values }));
        } else if (name === 'type') {
            const type = value.split('-')[0]
            const z_index = value.split('-')[1]
            setItemInformation(prev => ({ ...prev, [name]: type }));
            setItemInformation(prev => ({ ...prev, ['z_index']: z_index }));

        } else {
            setItemInformation(prev => ({ ...prev, [name]: value }));
        }

    };

    useEffect(() => {

        const itemTypeMapping = {
            2: { type: 'top', z_index: '2' },
            3: { type: 'short', z_index: '3' },
            4: { type: 'long', z_index: '1' },
            5: { type: 'sweater', z_index: '4' },
            6: { type: 'gakuran', z_index: '5' },
            7: { type: 'blazer', z_index: '5' },
        };

        if (itemTypeMapping[folderId]) {
            setItemInformation((prev) => ({
                ...prev,
                ...itemTypeMapping[folderId],
            }));
        }
    }, [folderId]);

    return (
        <form onSubmit={handleSubmit} className={styles.sizeForm}>
            <div style={{display: "flex", justifyContent: "space-around"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "2em"}}>
                    {image && (
                        <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        style={{ width: '200px', objectFit: 'cover', border: '1px solid #ccc' }}
                        />
                    )}
                    <label htmlFor="image">Inventory Image</label>
                    <input type="file" name="image" onChange={(e) =>  setImage(e.target.files[0])}/>
                </div>

                <div style={{display: "flex", flexDirection: "column", gap: "2em"}}>
                    {demoImage && demoImage.length > 0 && demoImage.map((img, index) => (
                        <img
                        key={index}
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '200px', objectFit: 'cover', border: '1px solid #ccc' }}
                        />
                    ))}
                    <label htmlFor="demo_image">Demo Image</label>
                    <input type="file" name="demo_image" multiple onChange={(e) => {
                        console.log(e.target.files[0])
                        setDemoImage(prev => [...prev, e.target.files[0]])
                    }} />

                    <input type="file" name="demo_image" multiple onChange={(e) => {
                        console.log(e.target.files[0])
                        setDemoImage(prev => [...prev, e.target.files[0]])
                    }} />
                </div>
            </div>

            {folderId === 8 && (
                <>
                    <label htmlFor="image">Loại</label>
                    <select name="type" value={itemInformation.type+"-"+itemInformation.z_index} onChange={handleChange}>
                        <option value="bow-5">Bow</option>
                        <option value="tie-3">Tie</option>
                        <option value="bag-6">Bag</option>
                    </select>
                </>

            )}

            <label htmlFor="image">Giá tiền</label>
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


            {itemInformation.type !== '' &&
                !['bow', 'tie', 'bag'].includes(itemInformation.type) && (
                    <div className={styles.checkboxGroup}>
                        {(itemInformation.type === 'gakuran'
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
                )}

            <div className={styles.action} >
                <button type="submit" className={styles.saveButton} >
                    Hoàn tất
                </button>
            </div>
        </form>
    );
}