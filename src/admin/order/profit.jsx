import { useEffect, useState, useMemo } from "react"
import axios from "axios";
import { ShoppingBag, TrendingUp, CheckCircle, Wallet } from "lucide-react";
import Expense from "../static/expense";
import styles from "./order.module.css"

export default function Profit({ status, listOrder, monthYear }) {

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
        notReady: listOrder.filter(order => order.order_status === "not-ready"),
        ready: listOrder.filter(order => order.order_status === "ready"),
        delivered: listOrder.filter(order => order.order_status === "delivered"),
        buyerReceived: listOrder.filter(order => order.order_status === "buyer-received"),
        buyerReturn: listOrder.filter(order => order.order_status === "buyer-return"),
        finished: listOrder.filter(order => order.order_status === "finished")
    };

    if (status === "unpaid") return (
        <div className={styles.static}>
            <StatCards listOrder={listOrder} />
        </div>
    )


    return (
        <div className={styles.static}>

            <StatCards listOrder={listOrder} statusGroups={statusGroups} totalExpense={totalExpense} showProfit />

            <Expense allExpense={filteredByDate ? filteredByDate : allExpense} totalExpense={totalExpense} reset={reset} setReset={setReset} />

        </div>
    );
}

// New Stat Cards Component
const StatCards = ({ listOrder, statusGroups, totalExpense, showProfit }) => {
    const totalOrders = listOrder.length;
    const totalRevenue = listOrder.reduce((sum, order) => sum + (order.total || 0), 0);

    const finishedOrders = statusGroups?.finished?.length || 0;
    const finishedRevenue = statusGroups?.finished?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const netProfit = finishedRevenue - (totalExpense || 0);

    return (
        <div className={styles.statGrid}>
            {/* Total Orders */}
            <div className={styles.statCard}>
                <div className={styles.statHeader}>
                    <div className={styles.statIcon}>
                        <ShoppingBag size={18} color="#666" />
                    </div>
                    <span className={styles.statLabel}>Tổng đơn</span>
                </div>
                <span className={styles.statValue}>{totalOrders}</span>
            </div>

            {/* Expected Revenue */}
            <div className={styles.statCard}>
                <div className={styles.statHeader}>
                    <div className={styles.statIcon}>
                        <TrendingUp size={18} color="#666" />
                    </div>
                    <span className={styles.statLabel}>Doanh thu dự kiến</span>
                </div>
                <span className={styles.statValue}>{totalRevenue.toLocaleString()}₫</span>
            </div>

            {showProfit && (
                <>
                    {/* Completed Orders */}
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <CheckCircle size={18} color="#065f46" />
                            </div>
                            <span className={styles.statLabel}>Đã hoàn thành</span>
                        </div>
                        <span className={styles.statValue}>{finishedOrders} đơn</span>
                    </div>

                    {/* Net Profit - Highlighted */}
                    <div className={`${styles.statCard} ${styles.highlight}`}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <Wallet size={18} color="#333" />
                            </div>
                            <span className={styles.statLabel}>Lợi nhuận</span>
                        </div>
                        <span className={styles.statValue}>{netProfit.toLocaleString()}₫</span>
                    </div>
                </>
            )}
        </div>
    );
};
