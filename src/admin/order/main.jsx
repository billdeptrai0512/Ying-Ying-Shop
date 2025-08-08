import { useEffect, useState, useMemo } from "react"
import styles from "./order.module.css"
import axios from "axios";
import SearchOrder from "./search-order";
import ListOrder from "./listOrder";

export default function Order() {
    const [monthYear, setMonthYear] = useState("");
    const [listOrder, setListOrder] = useState([]);
    const [status, setStatus] = useState("unpaid");
    const [filter, setFilter] = useState("");
    const [searchId, setSearchId] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [refresh, setRefresh] = useState(false);
  
    useEffect(() => {
      const fetchOrder = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order`);
          const sorted = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
          setListOrder(sorted);
        } catch (err) {
          console.error("fetch order:", err);
        }
      };
  
      fetchOrder();
    }, [refresh]);

    const filteredBySearchId = useMemo(() => {
      if (searchId === "") return [];
      return listOrder.filter(order => order.id === parseInt(searchId));
    }, [listOrder, searchId]);
  
    const filteredByDate = useMemo(() => {
      if (!monthYear) return listOrder;
      return listOrder.filter(order => {
        const date = new Date(order.date);
        return `${date.getMonth() + 1}/${date.getFullYear()}` === monthYear;
      });
    }, [listOrder, monthYear]);
  
    const filteredByPaidStatus = useMemo(() => {
      if (status === "searching") return [];
      return filteredByDate.filter(order => status === "paid" ? order.paid_status : !order.paid_status);
    }, [filteredByDate, status]);
  
    const filteredOrder = useMemo(() => {
      if (searchId.trim() !== "") {
        console.log(filteredBySearchId)
        return filteredBySearchId;
      }
    
      if (!filter) return filteredByPaidStatus;
      return filteredByPaidStatus.filter(order => order.order_status === filter);
    }, [searchId, filteredBySearchId, filteredByPaidStatus, filter]);
  
    useEffect(() => {
      if (filteredOrder.length > 0) setSelectedOrder(filteredOrder[0]);
    }, [filteredOrder]);
  
    return (
      <div className={styles.body}>
        <div className={styles.sectionBoard}>
          {renderDateFilter(monthYear, setMonthYear)}
          {renderPaidStatusFilter(status, setStatus)}
        </div>
  
        <div className={styles.orderListWrapper}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <SearchOrder status={status} setStatus={setStatus} setRefresh={setRefresh} searchId={searchId} setSearchId={setSearchId} />
            {renderOrderStatusFilter(filter, setFilter)}
          </div>
          <ListOrder filterOrder={filteredOrder} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} setRefresh={setRefresh} />
        </div>
  
      </div>
    );
  }

const renderDateFilter = (monthYear, setMonthYear) => {

    return (
      <select name="status" className={styles.input} style={{ marginBottom: 'unset' }}
        onChange={(e) => setMonthYear(e.target.value)} value={monthYear}>
           <option value="">Tất cả</option>
           <option value="6/2025">Tháng 6</option>
           <option value="7/2025">Tháng 7</option>
           <option value="8/2025">Tháng 8</option>
           <option value="9/2025">Tháng 9</option>
           <option value="10/2025">Tháng 10</option>
           <option value="11/2025">Tháng 11</option>
           <option value="12/2025">Tháng 12</option>
       </select>
    )
}

const renderPaidStatusFilter = (status, setStatus) => {

    return (
      <select name="status" className={styles.input} style={{ marginBottom: 'unset' }}
          onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="unpaid">Chưa thanh toán</option>
          <option value="paid">Đã thanh toán</option>
      </select>
    )
}

const renderOrderStatusFilter = (filter, setFilter) => {

    return (
        <select name="status" className={styles.input} onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="">Tất cả</option>
            <option value="not-ready">Chưa đóng đơn</option>
            <option value="ready">Đã đóng đơn</option>
            <option value="delivered">Đã gửi hàng</option>
            <option value="buyer-received">Đã nhận hàng</option>
            <option value="buyer-return">Đang trả hàng</option>
            <option value="finished">Xong đơn</option>
        </select>
    )
}
  