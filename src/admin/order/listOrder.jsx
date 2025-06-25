
import { Link } from "react-router-dom"
import styles from "./order.module.css"
import DeleteOrder from "./delete-order";
import UpdateStatusOrder from "./update-order";


export default function ListOrder({filterOrder, selectedOrder, setSelectedOrder, setRefresh}) {

    const selectOrder = (index) => {

        return setSelectedOrder(filterOrder[index])

    }

    return (
            <>
                {filterOrder.length === 0 ? (
                    <p className={styles.emptyText}> no order</p>
                ) : (
                    <ul className={styles.orderList}>
                        {filterOrder.map((order, index) => (
                            <li key={order.id} className={styles.orderItem}
                                style={selectedOrder?.id === order.id ? { border: '5px solid #E3C4C1' } : {}}
                                onClick={() => selectOrder(index)}>
                            <header className={styles.orderHeader}>
                                <Link to={`/checkout/${order.id}`} >#{order.id}</Link>
                            </header>
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
                            <div className={styles.orderActions} style={order.paid_status === false ? { justifyContent: "end" } : {justifyContent: "space-between"} }>
                                <DeleteOrder orderId={order.id} setRefresh={setRefresh} />
                                {order.paid_status === false ? (
                                    null
                                ) : (
                                    <UpdateStatusOrder orderId={order.id} setRefresh={setRefresh} currentStatus={order.order_status}/>
                                )}
                            </div>
                            </li>
                        ))}
                    </ul>
                )}
            </>


    )
  }
  