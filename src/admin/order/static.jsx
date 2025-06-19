import styles from "./order.module.css"


export default function Static({listOrder}) {

    console.log(listOrder[0])
    // how many status ? 
    // how to filter each status and then return listOrder based on those filter
    // how to get total revenue ?
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

                <span className={styles.statusLabel}>Chưa đóng đơn: {statusGroups.notReady.length}</span>

                <span className={styles.statusLabel}>Đã đóng đơn: {statusGroups.ready.length}</span>

                <span className={styles.statusLabel}>Đã gửi hàng: {statusGroups.delivered.length}</span>


                <span className={styles.statusLabel}>Đã nhận hàng: {statusGroups.buyerReceived.length}</span>


                <span className={styles.statusLabel}>Đã trả hàng: {statusGroups.buyerReturn.length}</span>


                <span className={styles.statusLabel}>Hoàn thành: {statusGroups.finished.length}</span>

                <span className={styles.statusLabel}>Doanh thu dự kiến: {totalPreRevenue.toLocaleString()}đ</span>

                <span className={styles.statusLabel}>Tổng doanh thu: {totalRevenue.toLocaleString()}đ</span>

            </div>

    )
  }
  