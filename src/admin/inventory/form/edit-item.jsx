import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import styles from "../inventory.module.css"
import DeleteItem from './delete-item';


export default function EditItem({ selectedItem, setReset, setSelectedItem }) {

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const [image, setImage] = useState(null);
    const [demoPreview, setDemoPreview] = useState([]);
    const [demoFiles, setDemoFiles] = useState([]);
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

        demoFiles.forEach(file => data.append("demo_image", file));

        data.append('image', image);
        data.append('amount', itemInformation.amount);
        data.append('total', itemInformation.total);
        data.append('type', itemInformation.type);
        data.append('z_index', itemInformation.z_index);
        console.log(demoPreview)

        itemInformation.sizes.forEach(size => {
            data.append('sizes[]', size);
        });

        try {

            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/item/edit/${selectedItem.id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
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

        setItemInformation({
            amount: selectedItem.amount || '',
            total: selectedItem.total || '',
            type: selectedItem.type || '',
            z_index: selectedItem.z_index || '',
            sizes: selectedItem.sizes || [],
        });

        // Selected item already contains image URLs
        setImage(selectedItem.image || []);
        setDemoPreview(selectedItem.demo_image || []);
        setDemoFiles([]); // clear new uploads
    }, [selectedItem]);

    console.log(selectedItem)

    return (
        <form onSubmit={handleSubmit} className={styles.sizeForm} style={{ width: "unset" }}>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: "1em", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

                    <label htmlFor="inventory_image">Inventory Image</label>

                    <label htmlFor="inventory_image" style={{ cursor: "pointer", width: "200px" }}>
                        {image ? (
                            <img
                                src={image}
                                alt="Preview"
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    objectFit: "cover",
                                    border: "1px solid #ccc",
                                    borderRadius: "6px"
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    border: "1px dashed #aaa",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#555",
                                }}
                            >
                                Click to upload
                            </div>
                        )}
                    </label>

                    <input
                        id="inventory_image"
                        type="file"
                        name="image"
                        style={{ display: "none" }}  // HIDE INPUT
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const files = Array.from(e.target.files);
                                const previewURLs = files.map(file => URL.createObjectURL(file));
                                setImage(previewURLs);
                            }
                        }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label>Demo Image</label>

                    <label
                        htmlFor="demo_image_input"
                        style={{
                            display: "flex", flexWrap: "wrap", gap: "1em",
                            cursor: "pointer"
                        }}
                    >
                        {demoPreview && demoPreview.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {demoPreview.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Preview ${index + 1}`}
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "cover",
                                            border: "1px solid #ccc",
                                            borderRadius: "6px"
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    border: "1px dashed #aaa",
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#777"
                                }}
                            >
                                Click to upload
                            </div>
                        )}
                    </label>

                    {/* Hidden input for MULTIPLE uploads */}
                    <input
                        id="demo_image_input"
                        type="file"
                        name="demo_image"
                        multiple
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const files = Array.from(e.target.files);

                            const previewURLs = files.map(file => URL.createObjectURL(file));

                            setDemoFiles(prev => [...prev, ...files]);       // Files for backend upload
                            setDemoPreview(prev => [...prev, ...previewURLs]); // URLs for UI preview
                        }}
                    />
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "1em",
                    flexWrap: isMobile ? "nowrap" : "wrap",
                    minWidth: 0,
                    alignItems: "center"
                }}
            >
                <div style={{ display: "flex", gap: "8px", flexDirection: "column", minWidth: 0 }}>
                    <label style={{ whiteSpace: "nowrap" }}>Giá tiền</label>
                    <input
                        type="text"
                        name="total"
                        value={itemInformation.total}
                        onChange={handleChange}
                        style={{ width: "50%", minWidth: 0 }}
                    />
                </div>

                <div style={{ display: "flex", gap: "8px", flexDirection: "column", minWidth: 0 }}>
                    <label style={{ whiteSpace: "nowrap" }}>Số lượng</label>
                    <input
                        type="number"
                        name="amount"
                        value={itemInformation.amount}
                        onChange={handleChange}
                        style={{ width: "50%", minWidth: 0 }}
                    />
                </div>
            </div>

            {['bow', 'tie', 'bag'].includes(itemInformation.type) && (
                <>
                    <label htmlFor="image">Loại</label>
                    <select name="type" style={{ width: "fit-content", whiteSpace: "wrap" }} value={itemInformation.type + "-" + itemInformation.z_index} onChange={handleChange}>
                        <option value="bow-5">Bow</option>
                        <option value="tie-3">Tie</option>
                        <option value="bag-6">Bag</option>
                    </select>
                </>

            )}

            {
                !['bow', 'tie', 'bag'].includes(itemInformation.type) && (
                    <div className={styles.checkboxGroup} >
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
                )
            }


            <div className={styles.action}>
                <button className={styles.deleteButton} onClick={() => setSelectedItem(null)}>
                    Quay lại
                </button>
                <button type="submit" className={styles.saveButton} >
                    Lưu
                </button>
                <DeleteItem fileId={selectedItem.id} setReset={setReset} />
            </div>


        </form>
    );
}