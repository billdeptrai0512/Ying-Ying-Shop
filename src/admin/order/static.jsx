
import { useEffect, useState, useMemo } from "react"
import axios from "axios";
import styles from "./order.module.css"
import Expense from "./expense";

export default function Static({status, statusOrder, monthYear}) {

    const [allExpense, setAllExpense] = useState()
    const [totalExpense, setTotalExpense] = useState();
    const [reset, setReset] = useState(true)

    const fecthExpense = async () => {
        try {

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/expense`);
            return response.data || [];

        } catch (err) {
            console.error("Failed to fetch expenses:", err);
            return [];
        }
    }

    useEffect(() => {

        const fetchAndSetExpense = async () => {
            const expenses = await fecthExpense();

            setAllExpense(expenses)

            const total = expenses.reduce((sum, expense) => {
                return sum + (expense.total || 0); // giả sử `expense.total` là số tiền chi phí
            }, 0);

            setTotalExpense(total);
        }

        fetchAndSetExpense();

    }, [reset])

    const filteredByDate = useMemo(() => {

        if (!allExpense) return
        if (!monthYear) return allExpense;

        const filterExpense = allExpense.filter(expense => {
            const date = new Date(expense.date);
            return `${date.getMonth() + 1}/${date.getFullYear()}` === monthYear;
        });

        const total = filterExpense.reduce((sum, expense) => {
            return sum + (expense.total || 0); // giả sử `expense.total` là số tiền chi phí
        }, 0);

        setTotalExpense(total);

        return filterExpense

    }, [allExpense, monthYear]);


    // then we got the expense

    const statusGroups = {
        notReady: statusOrder.filter(order => order.order_status === "not-ready"),
        ready: statusOrder.filter(order => order.order_status === "ready"),
        delivered: statusOrder.filter(order => order.order_status === "delivered"),
        buyerReceived: statusOrder.filter(order => order.order_status === "buyer-received"),
        buyerReturn: statusOrder.filter(order => order.order_status === "buyer-return"),
        finished: statusOrder.filter(order => order.order_status === "finished")
    };

    if (status === "unpaid") return (

        <div className={styles.static}>

            { renderExpectProfit(statusOrder) }

        </div>
    )


    return (
        <div className={styles.static}>

            { renderExpectProfit(statusOrder) }

            <span className={styles.statusLabel}>-----------------------------------------------------------------------</span>

            <Expense allExpense={filteredByDate ? filteredByDate : allExpense} totalExpense={totalExpense} reset={reset} setReset={setReset}/>

            <span className={styles.statusLabel}>-----------------------------------------------------------------------</span>

            { renderTotalRevenue(statusGroups, totalExpense) }

        </div>
    );
}

const renderTotalRevenue = (statusGroups, totalExpense) => {

    const finishedOrder = statusGroups.finished

    const totalCountFinishedOrder = finishedOrder.length;

    const totalProfit = finishedOrder.reduce((sum, order) => {
        return sum + (order.total || 0); 
    }, 0);

    const totalRevenue = totalProfit - totalExpense

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.statusLabel}>Đã hoàn thành:</span>
                <span className={styles.statusLabel}>{totalCountFinishedOrder} đơn</span>
            </div> 

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.statusLabel}>Tổng lợi nhuận:</span>
                <span className={styles.statusLabel}>{totalRevenue.toLocaleString()}đ</span>
            </div> 
        </>


    )

}

const renderExpectProfit = (statusOrder) => {

    const totalCountofOrders = statusOrder.length;

    const totalPreRevenue = statusOrder.reduce((sum, order) => {
        return sum + (order.total || 0); 
    }, 0);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.statusLabel}>Tổng cộng:</span>
                <span className={styles.statusLabel}>{totalCountofOrders} đơn</span>
            </div>  

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.statusLabel}>Doanh thu dự kiến:</span>
                <span className={styles.statusLabel}>{totalPreRevenue.toLocaleString()}đ</span>
            </div> 
        </>
    )



}

  