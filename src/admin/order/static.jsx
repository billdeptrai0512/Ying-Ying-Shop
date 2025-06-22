import styles from "./order.module.css"


export default function Static({listOrder, setFilter}) {

    // "not-ready"
    // "ready"
    // "delivered"
    // "buyer-received"
    // "buyer-return"
    // "finished"

    const statusGroups = {
        notReady: listOrder.filter(order => order.order_status === "not-ready"),
        ready: listOrder.filter(order => order.order_status === "ready"),
        delivered: listOrder.filter(order => order.order_status === "delivered"),
        buyerReceived: listOrder.filter(order => order.order_status === "buyer-received"),
        buyerReturn: listOrder.filter(order => order.order_status === "buyer-return"),
        finished: listOrder.filter(order => order.order_status === "finished")
    };

    // 3. Tính tổng doanh thu (total revenue) từ các đơn đã hoàn tất (tuỳ bạn muốn lấy đơn nào)

    const totalPreRevenue = listOrder.reduce((sum, order) => {
        return sum + (order.total || 0); // giả sử `order.total` là số tiền đơn hàng
    }, 0);

    const finishedOrders = statusGroups.finished;
    const totalRevenue = finishedOrders.reduce((sum, order) => {
        return sum + (order.total || 0); // giả sử `order.total` là số tiền đơn hàng
    }, 0);

    return (

            <div className={styles.static}>

                <span className={styles.statusLabel} onClick={() => setFilter('not-ready')} >Chưa đóng đơn: {statusGroups.notReady.length}</span>

                <span className={styles.statusLabel} onClick={() => setFilter('ready')}>Đã đóng đơn: {statusGroups.ready.length}</span>

                <span className={styles.statusLabel} onClick={() => setFilter('delivered')}>Đã gửi hàng: {statusGroups.delivered.length}</span>


                <span className={styles.statusLabel} onClick={() => setFilter('buyer-received')}>Đã nhận hàng: {statusGroups.buyerReceived.length}</span>


                <span className={styles.statusLabel} onClick={() => setFilter('buyer-return')}>Đã trả hàng: {statusGroups.buyerReturn.length}</span>


                <span className={styles.statusLabel} onClick={() => setFilter('finished')}>Hoàn thành: {statusGroups.finished.length}</span>

                <span className={styles.statusLabel}>Doanh thu dự kiến: {totalPreRevenue.toLocaleString()}đ</span>

                <span className={styles.statusLabel}>Tổng doanh thu: {totalRevenue.toLocaleString()}đ</span>

            </div>

    )
  }
  