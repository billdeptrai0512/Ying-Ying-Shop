import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";
import styles from "./inventory.module.css"
import axios from "axios";
import UpdateMeasurements from "./form/update-measurement";
import EditItem from "./form/edit-item";
import CreateItem from "./form/create-item";
import DeleteItem from "./form/delete-item";


export default function Inventory() {

    const [id, setId] = useState(2)
    const [inventory, setInventory] = useState([])
    const [measurements, setMeasurements] = useState([])
    const [creatingItem, setCreatingItem] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [reset, setReset] = useState(true)

    const fetchData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/folder/${id}`, {
            headers: {
              "ngrok-skip-browser-warning": "true",
            }
          });

          
          const folderData = response.data;
          setInventory(folderData.files);
          setMeasurements(folderData.measurements);
        //   setSelectedOrder(folderData.files?.[0]);
      
        } catch (err) {
          console.error("fetch folder: " + err);
        } 
    };

    const selectItem = (itemId) => {
        const item = inventory.find(item => item.id === itemId);
        if (!item) return;
    
        if (selectedItem?.id === item.id) {
          setSelectedItem(null);
        } else {
          setSelectedItem(item);
        }

    };

    useEffect(() => {

        fetchData();

        setSelectedItem(null)

        setCreatingItem(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setMeasurements]);

    useEffect(() => {

        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset])

    return (
        <>
            <div className={styles.sectionBoard}>
                {/* <SearchOrder status={status} setStatus={setStatus} setRefresh={setRefresh} setListOrder={setListOrder}/> */}
                <div className={styles.section} 
                    onClick={() => setId(2)} 
                    style={id === 2 ? { backgroundColor: '#E3C4C1' } : {}}
                    >
                    Áo sơ mi
                </div>
                <div className={styles.section} 
                    onClick={() => setId(4)} 
                    style={id === 4  ? { backgroundColor: '#E3C4C1' } : {}}
                    >
                    Quần dài 
                </div>
                <div className={styles.section} 
                    onClick={() => setId(3)} 
                    style={id === 3  ? { backgroundColor: '#E3C4C1' } : {}}
                    >
                    Chân Váy
                </div>
                <div className={styles.section} 
                    onClick={() => setId(5)} 
                    style={id === 5 ? { backgroundColor: '#E3C4C1' } : {}}
                    >
                    Sweater 
                </div>
                <div className={styles.section} 
                    onClick={() => setId(7)} 
                    style={id === 7 ? { backgroundColor: '#E3C4C1' } : {}}
                    >
                    Blazer 
                </div>
                <div className={styles.section} 
                    onClick={() => setId(6)} 
                    style={id === 6 ? { backgroundColor: '#E3C4C1' } : {}}
                    >
                    Gakuran
                </div>
                <div className={styles.section} 
                    onClick={() => setId(8)} 
                    style={id === 8 ? { backgroundColor: '#E3C4C1' } : {}}
                    >
                    Cà vạt
                </div>


            </div>
            <div className={styles.orderListWrapper}>
                {!inventory ? (
                    <p className={styles.emptyText}>No item</p>
                ) : (
                    <>
                        <ul className={styles.cartList}>
                            {inventory.map(item => (
                                <li key={item.id} className={styles.cartItem}
                                    onClick={() => {
                                        selectItem(item.id)
                                        console.log("Selected item ID:", item.id);
                                    }}
                                    style={selectedItem?.id === item.id ? { border: '5px solid #E3C4C1' } : {}}>
                                    <img
                                        src={item.image}
                                        alt={`Item ${item.id}`}
                                        className={styles.itemImage}
                                    />
                                    <div>
                                        <p className={styles.itemSize}>ID: {item.id}</p>
                                        <p className={styles.itemId}>Số lượng: {item.amount}</p>
                                        <p className={styles.itemId}>Sizes: {
                                                            Array.isArray(item.sizes)
                                                            ? item.sizes.join(', ')
                                                            : item.sizes?.match(/(S|M|L|XL|XXL|XS)/g)?.join(', ') || item.sizes
                                                        }</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: "1em" }}>
                            <button type="button" className={styles.saveButton}
                                onClick={() => setCreatingItem(true)} >
                                    Thêm Item
                            </button>
                        </div>
                    </>

                )}
            </div>
            <div className={styles.orderDetailWrapper}>
                {selectedItem ? (
                        <EditItem selectedItem={selectedItem} setReset={setReset} />
                    ) : creatingItem ? (
                        <CreateItem folderId={id} setReset={setReset} setCreatingItem={setCreatingItem}/>
                    ) : (
                        <> 

                            <UpdateMeasurements
                                folderId={id}
                                measurements={measurements}
                                setMeasurements={setMeasurements}
                                setCreatingItem={setCreatingItem}
                                />
                        </>

                    )}
            </div>
            
        </>

    )
  }

  