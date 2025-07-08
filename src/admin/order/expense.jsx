
import { ChevronDown , ChevronUp , CirclePlus, CircleMinus, CircleX  } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./order.module.css"
import CreateExpense from "./form/createExpense";
import EditExpense from "./form/editExpense";

export default function Expense({allExpense, totalExpense, reset, setReset}) {

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [extend, setExtend] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState()

    useEffect(() => {

        setShowCreateModal(false)
        setShowEditModal(false)
        setExtend(false)

    }, [reset])

    const handleDelete = async (id) => {

        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/expense/delete/${id}`);

            alert("Thành công!");
            
            setReset((prev) => !prev)
        } catch (err) {
            console.error('Upload failed', err);
            alert("Xóa item thất bại");
        }
    };


    // if (!totalExpense) return (
    //     <div className={styles.statusLabel}>Đang tải...</div>
    // );

    return (
        <>  
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                <span className={styles.statusLabel} style={{display: "flex", gap: "5px"}}> Chi phí:

                    {showCreateModal ? 
                            (<CircleMinus size={18} color="#000" style={{ cursor: 'pointer' }} 
                                onClick={() => setShowCreateModal(false)} />)      
                            : 
                            (<CirclePlus size={18} color="#000" style={{ cursor: 'pointer' }} 
                                onClick={() => setShowCreateModal(true)} />)
                    }

                </span>

                <span style={{ display: 'flex', alignItems: 'center', gap: "5px" }}> 
                    
                    <span className={styles.statusLabel}>{ allExpense.length } đơn</span>

                    {extend ? 
                        <ChevronUp style={{cursor: "pointer"}} onClick={() => {
                            setExtend(false)
                            setShowEditModal(false)
                        }}/>
                        :
                        <ChevronDown style={{cursor: "pointer"}} onClick={() => setExtend(true)}/>    
                    }
                    
                </span>

            </div> 

            {showCreateModal && <CreateExpense setReset={setReset}/> }

            {showEditModal && selectedExpense && <EditExpense id={selectedExpense.id} name={selectedExpense.name} total={selectedExpense.total} setShowEditModal={setShowEditModal} setReset={setReset}/>}

            {extend && renderExpenseList(allExpense, setShowEditModal, setSelectedExpense, handleDelete)}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.statusLabel}>Tổng chi phí:</span>
                <span className={styles.statusLabel}>{totalExpense.toLocaleString()}đ</span>
            </div>  
        </>
    )
}

const renderExpenseList = (expenses, setShowEditModal, setSelectedExpense, handleDelete) => {


    return (
        <ul style={{ padding: 0, marginTop: '1rem' }}>
            {expenses.map((expense) => (
                <li key={expense.id} style={{ display: "flex", listStyle: 'none', marginBottom: '0.5rem', gap: "5px"}} >
                    <CircleX size={18} color="#000" style={{ cursor: 'pointer' }} 
                                onClick={() => handleDelete(expense.id)} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', width: "100%", cursor: "pointer" }} 
                        onClick={() => {
                            setShowEditModal(true)
                            setSelectedExpense(expense)
                        }}
                    >
                        <span className={styles.statusLabel} style={{display: "flex", gap: "5px"}}>
                            {formatDateToDDMM(expense.date)} | {expense.name}</span>
                            
                        <span className={styles.statusLabel}>
                            {expense.total ? expense.total.toLocaleString() + "đ" : "-"}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function formatDateToDDMM(isoString) {
    const date = new Date(isoString);
  
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // months start at 0

    return `${day} / ${month}`;
}

  