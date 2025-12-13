import { useEffect, useState, useMemo } from "react"
import styles from "./order.module.css"
import axios from "axios";
import Static from "./static";

export default function Profit() {
  const [monthYear, setMonthYear] = useState("");
  const [listOrder, setListOrder] = useState([]);
  const [status, setStatus] = useState("unpaid");

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
  }, []);

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


  return (
    <div className={styles.body}>
      <div className={styles.sectionBoard}>
        {renderDateFilter(monthYear, setMonthYear)}
        {renderPaidStatusFilter(status, setStatus)}

      </div>

      <div className={styles.orderListWrapper}>
        <Static statusOrder={filteredByPaidStatus} status={status} monthYear={monthYear} />
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
