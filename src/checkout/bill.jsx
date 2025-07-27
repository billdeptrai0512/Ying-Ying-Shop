import { useState, useEffect } from "react";
import { Heart } from 'lucide-react';
import { useCart } from "../public/cartContext"
import { useWebSocket } from "../public/webSocket";
import axios from "axios";
import styles from "./checkout.module.css";
import ScreenShotButton from "./button/screenshot";
import CopyButton from "./button/copy";
import EditButton from "./button/edit";
import SaveButton from "./button/save";
import FormEditOrder from "./form/editOrder"
import DenyButton from "./button/deny";

export default function Bill({ orderId }) {

    const { cart } = useCart()
    const { socket } = useWebSocket();

    const [order, setOrder] = useState({});
    const [paidStatus, setPaidStatus] = useState(false);
    const [updateOrder, setUpdateOrder] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const fetchOrder = async (orderId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/checkout/${orderId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching order for order ${orderId}:`, error);
            return [];
        }
    };
    
    useEffect(() => {
        const loadOrder = async () => {
            const order = await fetchOrder(orderId);
            setOrder(order);
            setPaidStatus(order.paid_status);
        };
    
        loadOrder();
    }, [orderId, updateOrder]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = async (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.id === orderId) {

                    setPaidStatus(true);

                    const updateInformation = {
                        total: cart.reduce((acc, item) => acc + item.total, 0),
                        cart: getAllItem(cart),
                    };

                    console.log("Updated cart information:", updateInformation);

                    // Use axios.patch to update the backend
                    await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/order/place-order/edit/${orderId}`, updateInformation)

                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error.message);
            }
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, orderId]);

    useEffect(() => {
        console.log("Component re-rendered. paidStatus:", paidStatus);
      }, [paidStatus]);

    if (!order.total) return <div className={styles.loading}>Loading...</div>;

    const isPaid = paidStatus || order.paid_status;

    if (!isPaid) {

        return (
            <div id="screenshot-area">
                {renderQRCode(order)}
                {renderPayment(order)}
            </div>
        );
    }

    return (
        <div id="screenshot-area">

            {renderConfirmation(order)}

            <div style={{display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center", marginTop:  editMode ? "0em" : "2em", padding: "0 2.5em"}}>
                <>
                    {editMode ? 
                        <FormEditOrder order={order} formId={"formEditOrder"} setEditMode={setEditMode} setUpdateOrder={setUpdateOrder}/>
                        :
                        renderCustomerInformation(order, cart, editMode)
                    }
                </> 
            </div>

            {renderButton(editMode, setEditMode)}

        </div>
    );


}

const renderButton = (editMode, setEditMode) => {
    return (
        <div style={{display: "flex", justifyContent: "center", marginTop: editMode ? "0em" : "1em", gap: "1rem"}}>
            <>
                {editMode ? 
                    <>
                        <SaveButton />
                        <DenyButton setEditMode={setEditMode}/>
                    </>
                    :
                    <>
                        <ScreenShotButton />
                        <EditButton setEditMode={setEditMode}/>
                    </>
                }
            </> 
        </div>
    )
}

const renderQRCode = (order) => {

    const bank = import.meta.env.VITE_BANK
    const account = import.meta.env.VITE_BANK_ACCOUNT

    return (
        <div style={{ textAlign: "center" }}>
            <img
                className={styles.qr}
                id="qr-code"
                src={`https://qr.sepay.vn/img?acc=${account}&bank=${bank}&amount=${order.total.toLocaleString()}&des=YS${order.id}&template=compact`}
                alt="QR Code"
                crossOrigin="anonymous"
            />
        </div>
    );
};

const renderPayment = (order, editMode) => {

    const renderBankInformation = () => {

        const bank = "Ngân hàng : ACB"

        const STK = "STK: 20495991"

        const accountName = "NGUYEN HOANG DIEU ANH"

        return (
            <>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <p className={styles.copyable}>
                        {bank}
                    </p>
                    <div style={{display: "flex", gap: "0.5rem"}}>
                        <p className={styles.copyable}>
                            {STK}
                        </p>
                        <CopyButton value={"20495991"} />
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <p className={styles.copyable}>
                        {accountName}
                    </p>
                </div>
            </>

        )
    }

    const renderTotalInfomation = (order) => {

        const total = order.total.toLocaleString()

        return (

            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    
                <div style={{display: "flex", gap: "0.5rem"}}>
                    <p className={styles.copyable}>
                        Tổng tiền: {total}đ 
                    </p>
                    <CopyButton value={total} />
                </div>

                <div style={{display: "flex", gap: "0.5rem"}}>
                    <p className={styles.copyable}>
                        Nội dung: YS{order.id}
                    </p>
                    <CopyButton value={`YS${order.id}`} />
                </div>
            
            </div>
        )
    }

    return (

        <div style={{display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center", marginTop:  editMode ? "0em" : "2em", padding: "0 1em"}}>
            <> 

                {renderBankInformation()}
                {renderTotalInfomation(order)}
                <div style={{display: "flex", justifyContent: "center", marginTop: editMode ? "0em" : "1em", gap: "1rem"}}>
                    <ScreenShotButton />
                </div>  
            </>
        </div>
    )
}

const renderConfirmation = (order) => {

    const total = order.total.toLocaleString()

    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#453130", padding: "3em 0", gap: "0.5em", margin: "0 2em 2em" }}>
                <Heart size={60} color="#E3C4C1" style={{ marginBottom: "2em" }} />
                <h2 style={{ color: "#FFFFFF", fontSize: "1.1em"}}>{`# ${order.id}`}</h2>
                <h3 style={{ fontSize: "1em", color: "#FFE1E1" }}>THANH TOÁN THÀNH CÔNG </h3>
                <h3 style={{ fontSize: "1em", color: "#FFE1E1" }}>TỔNG TIỀN : {total}đ </h3>
            </div>
        </div>
    )
}

const renderCustomerInformation = (order, cart) => {

    const renderCustomerName = () => {

        return (
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                
            <div style={{display: "flex", gap: "0.5rem"}}>
                <p className={styles.copyable}>
                        Họ và tên: 
                </p>
            </div>

            <div style={{display: "flex", gap: "0.5rem"}}>
                <p className={styles.copyable}>
                    {order.name} 
                </p>
            </div>
            
            </div>
        )
    }

    const renderCustomerContactInformation = () => {

        return (
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                
                <div style={{display: "flex", gap: "0.5rem"}}>
                    <p className={styles.copyable}>
                        Số điện thoại:  
                    </p>
                </div>

                <div style={{display: "flex", gap: "0.5rem"}}>
                    <p className={styles.copyable}>
                        (+84) {order.phone} 
                    </p>
                </div>
                
            </div>
        )
    }

    const renderCustomerAddress = () => {

        return (
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                
                <div style={{display: "flex", gap: "0.5rem"}}>
                    <p className={styles.copyable}>
                        Địa chỉ nhận hàng:
                    </p>
                </div>

                <div style={{display: "flex", gap: "0.5rem"}}>
                    <p className={styles.copyable}>
                        {`${order.address}`}
                    </p>
                </div>
                
            </div>
        )
    }

    const renderDate = () => {

        const count = CountItem(cart)

        return (
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                
                <div style={{display: "flex", gap: "0.5rem"}}>
                    <p className={styles.copyable}>
                        {`Đặt ${count} sản phẩm`}
                    </p>
                </div>

                <div style={{display: "flex", gap: "0.5rem"}}>
                    <p className={styles.copyable}>                         
                        {new Date(order.date).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}
                    </p>
                </div>
                
            </div>
        )
    }

    return (
        <> 
            {renderCustomerName()}
            {renderCustomerContactInformation()}
            {renderDate()}
            {renderCustomerAddress()}
        </>
    )
}

// const formatCurrency = (value) => {
//     if (!value) value = 0
//     const intValue = Math.floor(value);
//     return intValue.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + "đ";
// };

const getAllItem = (cart) => {
    return cart.flatMap(outfit => {
        const items = [];
        if (outfit.extra) {
            if (outfit.extra.neck?.item) items.push(outfit.extra.neck.item);
            if (outfit.extra.bag?.item) items.push(outfit.extra.bag.item);
        }
        if (outfit.size) items.push(outfit.size.item);
        return items;
    });
};

const CountItem = (cart) => {

    let result = 0;

    const count = (section) => {
        if (section && typeof section === 'object') {
            if ('item' in section) {
                if (section.item !== null) {
                    result += 1;
                }
            }

            Object.values(section).forEach(value => {
                if (typeof value === 'object') {
                    count(value);
                }
            });
        }
    };
    
    cart.forEach(outfit => {
        Object.values(outfit).forEach(section => {
            count(section);
        });

    });
    
    return result;
};