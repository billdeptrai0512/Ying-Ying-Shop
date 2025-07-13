import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";
import styles from "./inventory.module.css"
import axios from "axios";
import UpdateMeasurements from "./form/update-measurement";
import EditItem from "./form/edit-item";
import CreateItem from "./form/create-item";
import DeleteItem from "./form/delete-item";
import ListItem from "./listItem";
import SectionBoard from "./sectionBoard";


export default function Inventory() {

    const [id, setId] = useState(2)
    const [measurements, setMeasurements] = useState([])
    const [isCreating, setIsCreating] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [reset, setReset] = useState(true)

    const fetchMeasurements = async (folderId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/inventory/measurements/${folderId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });
            return response.data.measurements;
        } catch (error) {
            console.error(`Error fetching measurements for folder ${folderId}:`, error);
            return [];
        }
    };
    
    useEffect(() => {
        const loadMeasurements = async () => {
            const measurementsData = await fetchMeasurements(id);
            setMeasurements(measurementsData);
        };
    
        loadMeasurements();
    }, [id]);

    useEffect(() => {

        setIsCreating(false)

    }, [id]);

    return (
        <div className={styles.body}>
            <SectionBoard setId={setId} id={id} />

            <div className={styles.orderListWrapper}>
                <ListItem id={id} selectedItem={selectedItem} setSelectedItem={setSelectedItem} reset={reset}/>

                <div className={styles.action}>

                    {isCreating ? (
                        <button type="button" className={styles.deleteButton}
                            onClick={() => setIsCreating(false)} >
                            Quay lại
                        </button>
                    ) : (
                        <button type="button" className={styles.saveButton}
                            onClick={() => setIsCreating(true)}>
                            Thêm Item
                        </button>
                    )}

                </div>
            </div>

            <div className={styles.orderDetailWrapper}>
                {!selectedItem && !isCreating && (
                    <UpdateMeasurements
                        folderId={id}
                        measurements={measurements}
                        setMeasurements={setMeasurements}
                    />
                )}

                {selectedItem && !isCreating && (
                    <EditItem 
                        selectedItem={selectedItem} 
                        setReset={setReset} 
                    />
                )}

                {isCreating && (
                    <CreateItem 
                        folderId={id} 
                        setReset={setReset} 
                    />
                )}
            </div>
        </div>
    );
  }

  