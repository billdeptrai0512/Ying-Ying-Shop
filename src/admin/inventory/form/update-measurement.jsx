import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import styles from "../inventory.module.css"
import axios from "axios";

const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];

const keyTranslator = {
    height: "Chiều Cao",
    waist: "Eo",
    long: "Dài",
    weight: "Cân Nặng",
    shoulder: "Vai",
    chest: "Ngực",
    length: "Dài Áo",
};

export default function UpdateMeasurements({ folderId, measurements, setMeasurements }) {

    const [extend, setExtend] = useState(true);

    const saveMeasurement = async () => {
        try {

            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/inventory/${folderId}/measurements`, {
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
            alert(err);
        }
    }

    const handleExtend = () => {
        setExtend(!extend);
    }

    if (!measurements || Object.keys(measurements).length === 0) {
        return (
            <div style={{ width: "100%", display: "flex", justifyContent: "center", cursor: "pointer" }} onClick={handleExtend}>
                <p>Không có thông tin số đo</p>
            </div>
        )
    }

    if (!extend) {
        return (
            <div style={{ width: "100%", display: "flex", justifyContent: "center", cursor: "pointer" }} onClick={handleExtend}>
                <button type="button" className={styles.deleteButton}>
                    Xem số đo
                </button>
            </div>
        )
    }

    return (

        <form style={{ width: "unset" }}>
            {Object.entries(measurements)
                .sort(([a], [b]) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b))
                .map(([sizeKey, sizeValues], index) => (
                    <div key={index} className={styles.sizeRow}>
                        <label className={styles.sizeLabel}>{sizeKey}</label>
                        {Object.entries(sizeValues).map(([fieldKey, fieldValue]) => {
                            const translated = keyTranslator[fieldKey] || fieldKey;

                            return (
                                <div
                                    key={fieldKey}
                                    style={{ display: "flex", gap: "10px", alignItems: "center" }}
                                >
                                    <p style={{ fontSize: "0.875em", whiteSpace: "nowrap" }}>{translated}</p>
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
                ))}

            <div className={styles.action}>

                <button type="button" className={styles.deleteButton}
                    onClick={() => handleExtend()}>
                    Thu gọn
                </button>

                <button type="button" className={styles.saveButton}
                    onClick={() => saveMeasurement()}>
                    Lưu
                </button>

            </div>


        </form>

    )
}


