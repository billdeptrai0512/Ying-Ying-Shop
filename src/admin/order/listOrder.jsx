import { Link } from "react-router-dom"
import styles from "./order.module.css"
import DeleteOrder from "./delete-order";
import UpdateStatusOrder from "./update-order";

// Status badge mapping
const STATUS_CONFIG = {
    "not-ready": { label: "Chưa đóng đơn", className: styles.statusNotReady },
    "ready": { label: "Đã đóng đơn", className: styles.statusReady },
    "delivered": { label: "Đã gửi hàng", className: styles.statusDelivered },
    "buyer-received": { label: "Đã nhận hàng", className: styles.statusBuyerReceived },
    "buyer-return": { label: "Đang trả hàng", className: styles.statusBuyerReturn },
    "finished": { label: "Xong đơn", className: styles.statusFinished },
};

// Format delivery date (the date buyer requested to receive the order)
const formatDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // Reset time to compare dates only
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = dateOnly - nowOnly;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

    // Add relative text in parentheses if within 1 week
    if (diffDays === 0) return `${formattedDate} (Hôm nay)`;
    if (diffDays === 1) return `${formattedDate} (Ngày mai)`;
    if (diffDays === -1) return `${formattedDate} (Hôm qua)`;
    if (diffDays > 1 && diffDays <= 7) return `${formattedDate} (${diffDays} ngày nữa)`;
    if (diffDays < -1 && diffDays >= -7) return `${formattedDate} (${Math.abs(diffDays)} ngày trước)`;

    return formattedDate;
};

export default function ListOrder({ filterOrder, selectedOrder, setSelectedOrder, setRefresh }) {

    if (filterOrder.length === 0) return <p className={styles.emptyText}>Không có đơn hàng</p>

    return (
        <ul className={styles.orderList}>
            {filterOrder.map((order, index) => (
                <li
                    key={order.id}
                    className={`${styles.orderItem} ${selectedOrder?.id === order.id ? styles.orderItemSelected : ''}`}
                    onClick={() => setSelectedOrder(filterOrder[index])}
                >
                    <header className={styles.orderHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Link to={`/checkout/${order.id}`} className={styles.orderId}>#{order.id}</Link>
                            <span className={styles.orderDate}>{formatDeliveryDate(order.date)}</span>
                        </div>
                        <DeleteOrder orderId={order.id} setRefresh={setRefresh} />
                    </header>

                    {/* Status Badge */}
                    {order.paid_status && order.order_status && (
                        <div style={{ marginBottom: '0.5rem' }}>
                            <span className={`${styles.statusBadge} ${STATUS_CONFIG[order.order_status]?.className || ''}`}>
                                {STATUS_CONFIG[order.order_status]?.label || order.order_status}
                            </span>
                        </div>
                    )}

                    <div className={styles.orderInfoGrid}>
                        <span className={styles.label}>Khách hàng:</span>
                        <span>{order.name || "Không rõ"}</span>

                        <span className={styles.label}>SĐT:</span>
                        <span>{order.phone || "Không rõ"}</span>

                        <span className={styles.label}>Địa chỉ:</span>
                        <span>{order.address || "Không rõ"}</span>

                        <span className={styles.label}>Tổng tiền:</span>
                        <span style={{ fontWeight: 600, color: '#E3C4C1' }}>
                            {order.total ? `${order.total.toLocaleString()}₫` : "N/A"}
                        </span>

                        {order.paid_status === true && (
                            <>
                                <span className={styles.label}>Cập nhật:</span>
                                <span><UpdateStatusOrder orderId={order.id} setRefresh={setRefresh} currentStatus={order.order_status} /></span>
                            </>
                        )}
                    </div>

                    <div className={styles.orderActions}>
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
                <li key={item.id} className={styles.cartItem} style={{ width: "fit-content" }}>
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