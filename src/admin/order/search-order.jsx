import { useEffect } from "react";
import styles from "./order.module.css"


export default function SearchOrder({ status, setStatus, searchId, setSearchId }) {

  useEffect(() => {
    setSearchId('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (

        <input 
          onClick={() => setStatus('searching')} 
          // style={status === 'searching' ? { backgroundColor: '#E3C4C1' } : {}}
          className={styles.input}
          type="search" 
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder= "Order ID"
        />

  );
}
