import { CirclePlus } from 'lucide-react';
import styles from "../inventory.module.css"
import axios from "axios";

export default function UpdateMeasurements({folderId, measurements, setMeasurements, setCreatingItem}) {

    const saveMeasurement = async () => {
        try {

            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/folder/${folderId}/measurements`, {
                measurements: measurements
            }, {
                headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
                }
            });
                alert("Thành công!");
            } catch (err) {
                console.error(err);
                alert("Có lỗi xảy ra khi cập nhật.");
        }
    }

    if (!measurements || Object.keys(measurements).length === 0) {
        return  <button type="button" className={styles.deleteButton}
                    onClick={() => setCreatingItem(true)} >
                    Tạo item mới
                </button>;
    }

    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];

    return (

        <form className={styles.sizeForm}>
            {Object.entries(measurements)
                .sort(([a], [b]) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b))
                .map(([sizeKey, sizeValues], index) => (
                    <div key={index} className={styles.sizeRow}>
                        <label className={styles.sizeLabel}>{sizeKey}</label>
                        <div style={{ display: "flex", gap: "1em" }}>
                            {Object.entries(sizeValues).map(([fieldKey, fieldValue]) => {
                                const translated = keyTranslator[fieldKey] || fieldKey;

                                return (
                                    <div
                                        key={fieldKey}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "1em",
                                            textAlign: "center",
                                        }}
                                    >
                                        <p>{translated}</p>
                                        <input
                                            type="text"
                                            value={fieldValue}
                                            className={styles.input}
                                            onChange={(e) =>
                                                setMeasurements((prev) => ({
                                                    ...prev,
                                                    [sizeKey]: {
                                                        ...prev[sizeKey],
                                                        [fieldKey]: e.target.value,
                                                    },
                                                }))
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
            ))}

            <div className={styles.action}>

                <button type="button" className={styles.saveButton} 
                    onClick={() => saveMeasurement()}>
                    Lưu thay đổi
                </button>
                
                <button type="button" className={styles.deleteButton}
                    onClick={() => setCreatingItem(true)} >
                    Tạo item mới
                </button>

            </div>  


        </form>

    )
  }

  const keyTranslator = {
    height: "Chiều Cao",
    waist: "Eo",
    long: "Dài",
    weight: "Cân Nặng",
    shoulder: "Vai",
    chest: "Ngực",
    length: "Dài Áo",
};
  