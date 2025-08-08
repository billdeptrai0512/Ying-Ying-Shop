import axios from "axios";

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

  return (
    <form style={{padding: "unset"}}>
      <select name="status" value={currentStatus} onChange={handleStatusChange} style={{padding: "unset"}}>
        <option value="not-ready">Chưa đóng đơn</option>
        <option value="ready">Đã đóng đơn</option>
        <option value="delivered">Đã gửi hàng</option>
        <option value="buyer-received">Đã nhận hàng</option>
        <option value="buyer-return">Đang trả hàng</option>
        <option value="finished">Xong đơn</option>
      </select>
    </form>
  );
}
