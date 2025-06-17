import { useEffect, useState } from "react"
import styles from "./admin.module.css"
import axios from "axios";
import DeleteOrder from "./delete-order";
import UpdateStatusOrder from "./update-order";
import SearchOrder from "./search-order";

export default function Inventory() {

    const [id, setId] = useState(2)
    const [itemId, setItemId] = useState(0)
    const [folder, setFolder] = useState(null)
    const [inventory, setInventory] = useState([])
    const [measurements, setMeasurements] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null) // mention be order.id
    const [refresh, setRefresh] = useState(false)

    const fetchData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/folder/${id}`, {
            headers: {
              "ngrok-skip-browser-warning": "true",
            }
          });

          
          const folderData = response.data;
          setFolder(folderData);
          setInventory(folderData.files);
          setMeasurements(folderData.measurements);
        //   setSelectedOrder(folderData.files?.[0]);
      
        } catch (err) {
          console.error("fetch folder: " + err);
        } 
    };

    const selectOrder = (index) => {

        return setSelectedOrder(inventory[index])

    }
    

    useEffect(() => {

        fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (inventory.length > 0) {
          setSelectedOrder(inventory[0]);
        }
      }, [inventory]);


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
                {!selectedOrder ? (
                    <p className={styles.emptyText}>No item</p>
                ) : (
                    <ul className={styles.cartList}>
                        {inventory.map(item => (
                            <li key={item.id} className={styles.cartItem}
                                onClick={() => {
                                    setItemId(item.id)
                                    console.log("Selected item ID:", item.id);
                                }}
                                style={itemId === item.id ? { border: '5px solid #E3C4C1' } : {}}>
                                <img
                                    src={item.image}
                                    alt={`Item ${item.id}`}
                                    className={styles.itemImage}
                                />
                                <div>
                                    <p className={styles.itemSize}>ID: {item.id}</p>
                                    <p className={styles.itemId}>Sizes: {item.sizes}</p>
                                    <p className={styles.itemId}>Số lượng: {item.amount}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles.orderDetailWrapper}>
                <form className={styles.sizeForm}>
                    {Object.entries(measurements).map(([sizeKey, sizeValues], index) => (
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

                    <button type="button" className={styles.saveButton} 
                        onClick={async () => {
                            try {
                                const cleaned = Object.fromEntries(
                                    Object.entries(measurements).map(([size, { height, weight }]) => [
                                      size,
                                      {
                                        height: height,
                                        weight: weight,
                                      },
                                    ])
                                );

                                console.log(measurements);

                                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/folder/${id}/measurements`, {
                                    measurements: cleaned
                                }, {
                                    headers: {
                                    "Content-Type": "application/json",
                                    "ngrok-skip-browser-warning": "true"
                                    }
                                });
                                alert("Cập nhật bảng size thành công!");
                                } catch (err) {
                                console.error(err);
                                alert("Có lỗi xảy ra khi cập nhật.");
                                }
                        }}>
                        Lưu thay đổi
                    </button>
                </form>
            </div>
            
        </>

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
  