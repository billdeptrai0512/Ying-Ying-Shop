import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import styles from './order.module.css';

export default function DeleteOrder({ orderId, setRefresh }) {
    const [showDialog, setShowDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/order/delete/${orderId}`);
            setRefresh(prev => !prev);
        } catch (err) {
            console.error('Delete failed', err);
        } finally {
            setIsDeleting(false);
            setShowDialog(false);
        }
    };

    return (
        <>
            <div
                className={styles.deleteBtn}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowDialog(true);
                }}
            >
                <Trash2 size={16} />
            </div>

            {showDialog && (
                <div className={styles.dialogOverlay} onClick={() => setShowDialog(false)}>
                    <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.dialogTitle}>Xóa đơn hàng</h3>
                        <p className={styles.dialogMessage}>
                            Bạn có chắc muốn xóa đơn hàng <strong>#{orderId}</strong>?
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className={styles.dialogActions}>
                            <button
                                className={`${styles.dialogBtn} ${styles.dialogBtnCancel}`}
                                onClick={() => setShowDialog(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className={`${styles.dialogBtn} ${styles.dialogBtnConfirm}`}
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}