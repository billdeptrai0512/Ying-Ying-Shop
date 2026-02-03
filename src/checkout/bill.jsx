import { useState, useEffect } from "react";
import { useCart } from "../public/cartContext";
import { useWebSocket } from "../public/webSocket";
import axios from "axios";
import styles from "./checkout.module.css";

// Split components
import QRCodeSection, { BankInfo, TotalInfo } from "./button/qr-section";
import OrderConfirmation from "./button/order-confirmation";
import CustomerInfo from "./button/customer-info";
import ScreenShotButton from "./button/screenshot";
import CopyButton from "./button/copy";
import EditButton from "./button/edit";
import SaveButton from "./button/save";
import DenyButton from "./button/deny";
import FormEditOrder from "./form/editOrder";

export default function Bill({ orderId }) {
    const { cart } = useCart();
    const { socket } = useWebSocket();

    const [order, setOrder] = useState({});
    const [paidStatus, setPaidStatus] = useState(false);
    const [updateOrder, setUpdateOrder] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch order data
    useEffect(() => {
        const loadOrder = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/order/checkout/${orderId}`,
                    { headers: { "ngrok-skip-browser-warning": "true" } }
                );
                setOrder(response.data);
                setPaidStatus(response.data.paid_status);
            } catch (err) {
                console.error(`Error fetching order ${orderId}:`, err);
                setError("Không thể tải đơn hàng. Vui lòng thử lại.");
            } finally {
                setIsLoading(false);
            }
        };

        loadOrder();
    }, [orderId, updateOrder]);

    // WebSocket listener for payment updates
    useEffect(() => {
        if (!socket) return;

        const handleMessage = async (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.id === orderId) {
                    setPaidStatus(true);

                    const updateInfo = {
                        total: cart.reduce((acc, item) => acc + item.total, 0),
                        cart: getAllItems(cart),
                    };

                    await axios.patch(
                        `${import.meta.env.VITE_BACKEND_URL}/order/place-order/edit/${orderId}`,
                        updateInfo
                    );
                }
            } catch (err) {
                console.error("Error parsing WebSocket message:", err.message);
            }
        };

        socket.addEventListener("message", handleMessage);
        return () => socket.removeEventListener("message", handleMessage);
    }, [socket, orderId, cart]);

    // Loading state
    if (isLoading) {
        return <div className={styles.loading}>Đang tải...</div>;
    }

    // Error state
    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
                <button onClick={() => setUpdateOrder(prev => !prev)}>Thử lại</button>
            </div>
        );
    }

    // No order found
    if (!order.total) {
        return <div className={styles.loading}>Không tìm thấy đơn hàng</div>;
    }

    const isPaid = paidStatus || order.paid_status;

    // Unpaid order - show QR code
    if (!isPaid) {
        return (
            <div id="screenshot-area">
                <QRCodeSection order={order} />
                <div className={styles.paymentSection}>
                    <BankInfo />
                    <TotalInfo order={order} />
                    <div className={styles.buttonGroup}>
                        <ScreenShotButton />
                    </div>
                </div>
            </div>
        );
    }

    // Paid order - show confirmation
    return (
        <div id="screenshot-area">
            <OrderConfirmation order={order} />

            <div className={styles.paymentSection}>
                {editMode ? (
                    <FormEditOrder
                        order={order}
                        formId="formEditOrder"
                        setEditMode={setEditMode}
                        setUpdateOrder={setUpdateOrder}
                    />
                ) : (
                    <CustomerInfo order={order} cart={cart} />
                )}
            </div>

            <div className={styles.buttonGroup}>
                {editMode ? (
                    <>
                        <SaveButton />
                        <DenyButton setEditMode={setEditMode} />
                    </>
                ) : (
                    <>
                        <ScreenShotButton />
                        <EditButton setEditMode={setEditMode} />
                    </>
                )}
            </div>
        </div>
    );
}

// Helper: Extract all items from cart
function getAllItems(cart) {
    return cart.flatMap(outfit => {
        const items = [];
        if (outfit.extra) {
            if (outfit.extra.neck?.item) items.push(outfit.extra.neck.item);
            if (outfit.extra.bag?.item) items.push(outfit.extra.bag.item);
        }
        if (outfit.size) items.push(outfit.size.item);
        return items;
    });
}