
import { Link } from "react-router-dom"
import styles from "./order.module.css"
import DeleteOrder from "./delete-order";
import UpdateStatusOrder from "./update-order";


export default function ListOrder({filterOrder, selectedOrder, setSelectedOrder, setRefresh}) {

    if (filterOrder.length === 0) return <p className={styles.emptyText}> no order</p>

    return (
        <ul className={styles.orderList}>
            {filterOrder.map((order, index) => (
                <li key={order.id} className={styles.orderItem} onClick={() => setSelectedOrder(filterOrder[index])}
                    style={selectedOrder?.id === order.id ? { border: '5px solid #E3C4C1' } : {}}>
                <header className={styles.orderHeader}>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Link to={`/checkout/${order.id}`} >#{order.id}</Link>
                        {order.paid_status === true && <UpdateStatusOrder orderId={order.id} setRefresh={setRefresh} currentStatus={order.order_status}/> }
                    </div>

                    <DeleteOrder orderId={order.id} setRefresh={setRefresh} />

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
                <div className={styles.orderActions} >
                    {/* <DeleteOrder orderId={order.id} setRefresh={setRefresh} /> */}
                    {renderItemList(order)}
                </div>
                </li>
            ))}
        </ul>
    )
}

const renderItemList = (selectedOrder) => {

    if (!selectedOrder) return <p className={styles.emptyText}>No order selected</p>

    if (selectedOrder) return (

        <ul className={styles.cartList}>
            {selectedOrder.cart.map(item => (
                <li key={item.id} className={styles.cartItem} style={{width: "fit-content"}}>
                    <img
                        src={item.file.image}
                        alt={`Item ${item.id}`}
                        className={styles.itemImage}
                    />
                    <div>
                        <p className={styles.itemSize}>{item.file.name}</p>
                        <p className={styles.itemId}>Size: {item.size}</p>
                    </div>
                </li>
            ))}
        </ul>

    )

}
  