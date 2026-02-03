import { useEffect } from "react";
import { Search, X } from "lucide-react";
import styles from "./order.module.css"


export default function SearchOrder({ status, setStatus, searchId, setSearchId }) {

  useEffect(() => {
    setSearchId('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleClear = () => {
    setSearchId('');
  };

  return (
    <div className={styles.searchWrapper}>
      <Search size={18} />
      <input
        onClick={() => setStatus('searching')}
        className={styles.searchInput}
        type="text"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Tìm ID đơn hàng..."
      />
      {searchId && (
        <button className={styles.clearBtn} onClick={handleClear} type="button">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
