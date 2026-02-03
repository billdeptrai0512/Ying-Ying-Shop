import { useEffect, useState, useMemo } from "react"
import styles from "./order.module.css"
import axios from "axios";
import { Calendar, CreditCard, Filter, RotateCcw } from "lucide-react";
import SearchOrder from "./search-order";
import Profit from "./profit";
import ListOrder from "./listOrder";

export default function Order() {
  const [monthYear, setMonthYear] = useState(getCurrentMonthYear());
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

  const handleResetFilters = () => {
    setMonthYear(getCurrentMonthYear());
    setStatus("unpaid");
    setFilter("");
    setSearchId("");
  };

  const hasActiveFilters = monthYear !== getCurrentMonthYear() || status !== "unpaid" || filter !== "" || searchId !== "";

  return (
    <div className={styles.body}>
      <div className={styles.sectionBoard}>
        {/* Enhanced Filter Section */}
        <div className={styles.filterWrapper}>
          {/* Date Filter */}
          <div className={styles.filterGroup}>
            <Calendar size={18} />
            <select
              className={styles.filterSelect}
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
            >
              <option value="">Tất cả</option>
              {generateMonthOptions().map(m => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Paid Status Filter */}
          <div className={styles.filterGroup}>
            <CreditCard size={18} />
            <select
              className={styles.filterSelect}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="unpaid">Chưa thanh toán</option>
              <option value="paid">Đã thanh toán</option>
            </select>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button className={styles.resetButton} onClick={handleResetFilters}>
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>

        {/* show profit based on month here */}
        <Profit monthYear={monthYear} status={status} listOrder={filteredOrder} />
      </div>

      <div className={styles.orderListWrapper}>
        <div className={styles.filterWrapper}>
          <SearchOrder status={status} setStatus={setStatus} setRefresh={setRefresh} searchId={searchId} setSearchId={setSearchId} />

          {/* Order Status Filter */}
          <div className={styles.filterGroup}>
            <Filter size={18} />
            <select
              className={styles.filterSelect}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="not-ready">Chưa đóng đơn</option>
              <option value="ready">Đã đóng đơn</option>
              <option value="delivered">Đã gửi hàng</option>
              <option value="buyer-received">Đã nhận hàng</option>
              <option value="buyer-return">Đang trả hàng</option>
              <option value="finished">Xong đơn</option>
            </select>
            {filter && <span className={styles.filterBadge}>{filteredOrder.length}</span>}
          </div>
        </div>
        <ListOrder filterOrder={filteredOrder} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} setRefresh={setRefresh} />
      </div>

    </div>
  );
}

const getCurrentMonthYear = () => {
  const now = new Date();
  return `${now.getMonth() + 1}/${now.getFullYear()}`;
};

const generateMonthOptions = () => {
  const startYear = 2025;
  const endYear = 2030;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  return years.flatMap(year =>
    Array.from({ length: 12 }, (_, i) => ({
      value: `${i + 1}/${year}`,
      label: `Tháng ${i + 1}/${year}`,
    }))
  );
};
