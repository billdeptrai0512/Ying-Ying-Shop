import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./order.module.css"


export default function SearchOrder({ status, setStatus, setRefresh, setListOrder }) {

  const [searchId, setSearchId] = useState('')

  const handleSearch = async (orderId) => {

    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/search/${orderId}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          }
        });
        setListOrder(response.data)
        setRefresh(prev => !prev); // trigger refresh

      } catch (err) {
        console.error("Error updating status:", err);
      }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchId.trim() !== "") {
        handleSearch(searchId.trim());
      }
    }, 500); // wait 500ms after user stops typing
  
    return () => clearTimeout(delayDebounce); 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchId]);

  useEffect(() => {
    setSearchId('');
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
