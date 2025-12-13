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
            <div className={styles.sectionBoard}>
                <SectionBoard setId={setId} id={id} />
                <UpdateMeasurements folderId={id} measurements={measurements} setMeasurements={setMeasurements} />
            </div>

            <div className={styles.orderListWrapper}>

                {!selectedItem && !isCreating && (
                    <ListItem id={id} selectedItem={selectedItem} setSelectedItem={setSelectedItem}
                        setIsCreating={setIsCreating} reset={reset} />
                )}

                {selectedItem && !isCreating && (
                    <EditItem
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        setReset={setReset}
                    />
                )}

                {isCreating && (
                    <CreateItem
                        folderId={id}
                        setIsCreating={setIsCreating}
                        setReset={setReset}
                    />
                )}
            </div>

        </div>
    );
}

