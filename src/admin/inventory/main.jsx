import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";
import styles from "./inventory.module.css"
import axios from "axios";
import UpdateMeasurements from "./form/update-measurement";
import EditItem from "./form/edit-item";
import CreateItem from "./form/create-item";
import DeleteItem from "./form/delete-item";
import ListItem from "./listItem";


export default function Inventory() {

    const [id, setId] = useState(2)
    const [inventory, setInventory] = useState([])
    const [category, setCategory] = useState()
    const [measurements, setMeasurements] = useState([])
    const [listItem, setListItem] = useState()
    const [extraType, setExtraType] = useState('bow')
    const [isCreating, setIsCreating] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [reset, setReset] = useState(true)

    const getInventory = async () => {
        try {

          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/folder`, {
            headers: {
              "ngrok-skip-browser-warning": "true",
            }
          });

          const inventory = response.data;

          setInventory(inventory); 

        } catch (err) {

          console.error("fetch folder: " + err);

        } 
    };

    const selectItem = (itemId) => {

        const item = listItem.find(item => item.id === itemId);

        if (!item) return;

        console.log(item.demo_image)
        
        const isNotTheSameItem = selectedItem?.id !== item.id;

        setSelectedItem(isNotTheSameItem ? item : null);

    };

    const updateDisplayID = (updatedItems, folderId) => {
        setInventory((prevInventory) =>
            prevInventory.map((category) =>
                category.id === folderId
                    ? { ...category, files: updatedItems }
                    : category
            )
        );
    };

    useEffect(() => {

        getInventory()

    }, []);

    useEffect(() => {

        const result = inventory.find(category => category.id === id);

        setCategory(result)

        if (category) {

            setMeasurements(category.measurements);

            setListItem(category.files);

            setSelectedItem(null)
            
            setIsCreating(false)

        }

    }, [inventory, id, category]);


    useEffect(() => {

        if (!category) return

        if (category.id === 8) {

            const filterListItem = category.files.filter(item => item.type === extraType);

            setListItem(filterListItem);

        } 

    }, [category, extraType])

    useEffect(() => {

        getInventory()

    }, [reset])

    if (!inventory || !listItem) return <p className={styles.emptyText}>Có thể bạn chưa biết: Chủ shop rất dễ thươnggggg</p>

    return (
        <>
            <div className={styles.sectionBoard}>
                {inventory.sort((a, b) => a.id - b.id)
                    .map(category => (
                        <div 
                            key={category.id}
                            className={styles.section}
                            onClick={() => setId(category.id)}
                            style={id === category.id ? { backgroundColor: '#E3C4C1' } : {}}
                        >
                            {category.name}
                        </div>
                    ))}
            </div>

            <div className={styles.orderListWrapper}>
                <ListItem 
                    selectItem={selectItem}
                    selectedItem={selectedItem}
                    setExtraType={setExtraType}
                    listItem={listItem}
                    categoryId={id} 
                    updateDisplayID={updateDisplayID}
                />

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
        </>
    );
  }

  