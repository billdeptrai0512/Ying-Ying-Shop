import { useEffect, useState } from "react"
import styles from "./admin.module.css"
import axios from "axios";
import DeleteOrder from "./delete-order";
import UpdateStatusOrder from "./update-order";
import SearchOrder from "./search-order";

export default function Inventory() {

    const [status, setStatus] = useState("unpaid")
    const [listOrder, setListOrder] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null) // mention be order.id
    const [refresh, setRefresh] = useState(false)

    const fetchData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/${status}`, {
            headers: {
              "ngrok-skip-browser-warning": "true",
            }
          });
          setListOrder(response.data);
          setSelectedOrder(listOrder[0])
        } catch (err) {
          console.error("fetch folder: " + err);
        } 
    };

    const selectOrder = (index) => {

        return setSelectedOrder(listOrder[index])

    }

    useEffect(() => {

        if (status === "searching") return

        fetchData();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh, status]);

    useEffect(() => {
        if (listOrder.length > 0) {
          setSelectedOrder(listOrder[0]);
        }
      }, [listOrder]);


    return (
        <>
            <div className={styles.sectionBoard}>
                <SearchOrder status={status} setStatus={setStatus} setRefresh={setRefresh} setListOrder={setListOrder}/>
                <div className={styles.section} 
                    onClick={() => setStatus('unpaid')} 
                    style={status === 'unpaid' ? { backgroundColor: '#E3C4C1' } : {}}
                    >
                    Đơn chưa thanh toán
                </div>
                <div className={styles.section} 
                    onClick={() => setStatus('paid')} 
                    style={status === 'paid' ? { backgroundColor: '#E3C4C1' } : {}}
                    >
                    Đơn đã thanh toán
                </div>
            </div>
            <div className={styles.orderListWrapper}>
                {listOrder.length === 0 ? (
                    <p className={styles.emptyText}> {status === 'unpaid' ? "No unpaid order" : "No paid order"}</p>
                ) : (
                    <ul className={styles.orderList}>
                        {listOrder.map((order, index) => (
                            <li key={order.id} className={styles.orderItem}
                                style={selectedOrder?.id === order.id ? { border: '5px solid #E3C4C1' } : {}}
                                onClick={() => selectOrder(index)}>
                            <header className={styles.orderHeader}>#{order.id}</header>
                            <div className={styles.orderInfoGrid}>
                                <span className={styles.label}>Ngày thuê:</span>
                                <span>
                                    {new Date(order.date).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </span>

                                <span className={styles.label}>Khách hàng:</span>
                                <span>{order.name || "Không rõ"}</span>

                                <span className={styles.label}>Số điện thoại:</span>
                                <span>{order.phone || "Không rõ"}</span>

                                <span className={styles.label}>Địa chỉ nhận hàng:</span>
                                <span>{order.address || "Không rõ"}</span>

                                <span className={styles.label}>Tổng tiền:</span>
                                <span>{order.total ? `${order.total.toLocaleString()}₫` : "N/A"}</span>

                            </div>
                            <div className={styles.orderActions}>
                                <DeleteOrder orderId={order.id} setRefresh={setRefresh} />
                                {/* //status : đang soạn đơn - đã vận chuyển - đang trả về - hoàn thành
                                //update status of order */}
                                <UpdateStatusOrder orderId={order.id} setRefresh={setRefresh} currentStatus={order.order_status}/>
                            </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* what does the client want us to show here */}
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
  