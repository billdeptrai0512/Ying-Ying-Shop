import styles from "./order.module.css"


export default function Static({statusOrder}) {

    // "not-ready"
    // "ready"
    // "delivered"
    // "buyer-received"
    // "buyer-return"
    // "finished"

    const statusGroups = {
        notReady: statusOrder.filter(order => order.order_status === "not-ready"),
        ready: statusOrder.filter(order => order.order_status === "ready"),
        delivered: statusOrder.filter(order => order.order_status === "delivered"),
        buyerReceived: statusOrder.filter(order => order.order_status === "buyer-received"),
        buyerReturn: statusOrder.filter(order => order.order_status === "buyer-return"),
        finished: statusOrder.filter(order => order.order_status === "finished")
    };

    // 3. Tính tổng doanh thu (total revenue) từ các đơn đã hoàn tất (tuỳ bạn muốn lấy đơn nào)

    const totalPreRevenue = statusOrder.reduce((sum, order) => {
        return sum + (order.total || 0); // giả sử `order.total` là số tiền đơn hàng
    }, 0);

    const finishedOrders = statusGroups.finished;
    const totalRevenue = finishedOrders.reduce((sum, order) => {
        return sum + (order.total || 0); // giả sử `order.total` là số tiền đơn hàng
    }, 0);

    return (

            <div className={styles.static}>

                {/* The static will be divide by month/year -> (06/2025 - 07/2025)  */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.statusLabel}>Tổng cộng:</span>
                    <span className={styles.statusLabel}>{statusOrder.length} đơn</span>
                </div>  

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.statusLabel}>Doanh thu dự kiến:</span>
                    <span className={styles.statusLabel}>{totalPreRevenue.toLocaleString()}đ</span>
                </div> 

                {/* We gonna chi phí here */}
                <span className={styles.statusLabel}>-----------------------------------------------------------------------</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.statusLabel}>Chi phí:</span>
                    <span className={styles.statusLabel}>....</span>
                </div> 

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.statusLabel}>Bao gồm:</span>
                    <span className={styles.statusLabel}>....</span>
                </div> 


                <span className={styles.statusLabel}>-----------------------------------------------------------------------</span>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.statusLabel}>Tổng doanh thu:</span>
                <span className={styles.statusLabel}>{totalRevenue.toLocaleString()}đ</span>                </div> 
                

            </div>

    )
  }
  