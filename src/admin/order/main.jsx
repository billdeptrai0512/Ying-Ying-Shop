import { useEffect, useState } from "react"
import styles from "./order.module.css"
import axios from "axios";
import SearchOrder from "./search-order";
import Static from "./static";
import ListOrder from "./listOrder";

export default function Order() {

    //listOrder = [] // all order
    //statusOrder = [] // order after filter by status / paid - unpaid
    //filterOrder = [] // order after filter by status and filter by order_status  and filter by searchID
    const [monthYear, setMonthYear] = useState(``) // default month/year
    const [listOrder, setListOrder] = useState([])
    const [dateOrder, setDateOrder] = useState([])
    const [statusOrder, setStatusOrder] = useState([]) // this is not used in this component
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

            setStatusOrder(sorted.filter(order => order.paid_status === false))

            setSelectedOrder(filterOrder[0])

        } catch (err) {

          console.error("fetch folder: " + err);

        } 
    };

    useEffect(() => {
        
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    useEffect(() => {

        if(monthYear === ``) return setDateOrder(listOrder)
        
        const dateOrder = listOrder.filter(order => {

            const orderDate = new Date(order.date);
            const orderMonthYear = `${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
            return orderMonthYear === monthYear;

        })

        setDateOrder(dateOrder)

    }, [listOrder, monthYear, status]);

    //filter Paid Status
    useEffect(() => {

        if (status === "searching") return
        
        const paymentStatusOrder = dateOrder.filter(order => {

            if (status === "unpaid") {

                return order.paid_status === false;

            } else if (status === "paid") {

                return order.paid_status === true;

            }

        })

        setStatusOrder(paymentStatusOrder)


    }, [dateOrder, status]);

    //filter Order Status
    useEffect(() => {

        if (filter === "") return setFilterOrder(statusOrder)
        
        const filterOrder = statusOrder.filter(order => {

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

    }, [statusOrder ,filter]);

    useEffect(() => {

        if (listOrder.length > 0) {
          setSelectedOrder(listOrder[0]);
        }

    }, [listOrder]);


    return (
        <>
            <div className={styles.sectionBoard}>

                <select name="status" className={styles.input} style={{ marginBottom: 'unset' }}
                 onChange={(e) => setMonthYear(e.target.value)} value={monthYear}>
                    {/* default must be the month on current timer */}
                    <option value="">Tất cả</option>
                    <option value="6/2025">Tháng 6</option>
                    <option value="7/2025">Tháng 7</option>
                    <option value="8/2025">Tháng 8</option>
                    <option value="9/2025">Tháng 9</option>
                    <option value="10/2025">Tháng 10</option>
                    <option value="11/2025">Tháng 11</option>
                    <option value="12/2025">Tháng 12</option>
                </select>

                <div className={styles.section} 
                    onClick={() => setStatus('unpaid')} 
                    style={status === 'unpaid' ? { border: '5px solid #E3C4C1' } : {}}
                    >
                    Chưa thanh toán 
                </div>
                <div className={styles.section} 
                    onClick={() => setStatus('paid')} 
                    style={status === 'paid' ? { border: '5px solid #E3C4C1' } : {}}
                    >
                    Đã thanh toán
                </div>
                <Static statusOrder={statusOrder} setFilter={setFilter}/>
            </div>

            <div className={styles.orderListWrapper}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <SearchOrder status={status} setStatus={setStatus} setRefresh={setRefresh} setFilterOrder={setFilterOrder}/>
                    <select name="status" className={styles.input} onChange={(e) => setFilter(e.target.value)} value={filter}>
                        <option value="">Tất cả</option>
                        <option value="not-ready">Chưa đóng đơn</option>
                        <option value="ready">Đã đóng đơn</option>
                        <option value="delivered">Đã gửi hàng</option>
                        <option value="buyer-received">Đã nhận hàng</option>
                        <option value="buyer-return">Đang trả hàng</option>
                        <option value="finished">Xong đơn</option>
                    </select>
                </div>
                <ListOrder filterOrder={filterOrder} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} setRefresh={setRefresh} />
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
  