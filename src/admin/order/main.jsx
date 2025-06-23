import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import styles from "./order.module.css"
import axios from "axios";
import DeleteOrder from "./delete-order";
import UpdateStatusOrder from "./update-order";
import SearchOrder from "./search-order";
import Static from "./static";
import ListOrder from "./listOrder";

export default function Order() {

    const [listOrder, setListOrder] = useState([])
    const [filterOrder, setFilterOrder] = useState([])
    const [status, setStatus] = useState("unpaid")
    const [filter, setFilter] = useState("")
    const [selectedOrder, setSelectedOrder] = useState(null) // mention be order.id
    const [refresh, setRefresh] = useState(false)

    const fetchData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order`);

          const sorted = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));

          setListOrder(sorted);

          setSelectedOrder(listOrder[0])

        } catch (err) {

          console.error("fetch folder: " + err);

        } 
    };

    useEffect(() => {
        
        fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    useEffect(() => {

        if (status === "searching") return
        
        const filterOrder = listOrder.filter(order => {

            if (status === "unpaid") {

                return order.paid_status === false;

            } else if (status === "paid") {

                return order.paid_status === true && order.order_status !== "finished";

            }

        })

        setFilterOrder(filterOrder)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    useEffect(() => {

        if (filter === "") return
        
        const filterOrder = listOrder.filter(order => {

            if (filter === "not-ready") {

                return order.order_status === "not-ready";

            } else if (filter === "ready") {

                return order.order_status === "ready";

            } else if (filter === "delivered") {

                return order.order_status === "delivered";

            } else if (filter === "buyer-received") {

                return order.order_status === "buyer-received";

            } else if (filter === "buyer-return") {

                return order.order_status === "buyer-return";

            } else if (filter === "finished") {

                return order.order_status === "finished";

            }

        })

        setFilterOrder(filterOrder)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    useEffect(() => {

        if (listOrder.length > 0) {
          setSelectedOrder(listOrder[0]);
        }

    }, [listOrder]);


    return (
        <>
            <div className={styles.sectionBoard}>
                
                <div className={styles.section} 
                    onClick={() => setStatus('unpaid')} 
                    style={status === 'unpaid' ? { backgroundColor: '#E3C4C1' } : {}}
                    >
                    Chưa thanh toán 
                </div>
                <div className={styles.section} 
                    onClick={() => setStatus('paid')} 
                    style={status === 'paid' ? { backgroundColor: '#E3C4C1' } : {}}
                    >
                    Đã thanh toán
                </div>
                <Static listOrder={listOrder} setFilter={setFilter}/>
            </div>

            <div className={styles.orderListWrapper}>
                <SearchOrder status={status} setStatus={setStatus} setRefresh={setRefresh} setFilterOrder={setFilterOrder}/>
                <ListOrder listOrder={filterOrder} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} setRefresh={setRefresh} />
            </div>

            <div className={styles.orderDetailWrapper}>
                {!selectedOrder ? (
                    <p className={styles.emptyText}>No order selected</p>
                ) : (
                    <ul className={styles.cartList}>
                        {selectedOrder.cart.map(item => (
                            <li key={item.id} className={styles.cartItem}>
                                <img
                                    src={item.file.image}
                                    alt={`Item ${item.id}`}
                                    className={styles.itemImage}
                                />
                                <div>
                                    <p className={styles.itemSize}>Size: {item.size}</p>
                                    <p className={styles.itemId}>ID: {item.fileId}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
        </>

    )
  }
  