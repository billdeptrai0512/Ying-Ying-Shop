import axios from "axios";
import styles from "./order.module.css";

// Status color mapping for dropdown styling
const STATUS_OPTIONS = [
  { value: "not-ready", label: "Chưa đóng đơn", color: "#92400e" },
  { value: "ready", label: "Đã đóng đơn", color: "#1e40af" },
  { value: "delivered", label: "Đã gửi hàng", color: "#6b21a8" },
  { value: "buyer-received", label: "Đã nhận hàng", color: "#0e7490" },
  { value: "buyer-return", label: "Đang trả hàng", color: "#991b1b" },
  { value: "finished", label: "Xong đơn", color: "#065f46" },
];

export default function UpdateStatusOrder({ orderId, currentStatus, setRefresh }) {
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/order/update/${orderId}`, {
        status: newStatus,
      }, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        }
      });
      setRefresh(prev => !prev); // trigger refresh
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const currentOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus);

  return (
    <select
      name="status"
      value={currentStatus}
      onChange={handleStatusChange}
      className={styles.filterSelect}
      style={{
        padding: '0.35rem 0.5rem',
        backgroundColor: 'transparent',
        color: currentOption?.color || '#333',
        fontWeight: 600,
        fontSize: '0.85rem',
        minWidth: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {STATUS_OPTIONS.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
