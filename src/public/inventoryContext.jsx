import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const InventoryContext = createContext()

export const InventoryProvider = ({ children }) => {
    const [inventory, setInventory] = useState([])
    const [isRenderDone, setRenderDone] = useState(false)

    const fetchData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/inventory`, {
            headers: {
              "ngrok-skip-browser-warning": "true",
            }
          });
          setInventory(response.data);
        } catch (err) {
          console.error("fetch folder: " + err);
        } 
    };

    useEffect(() => {
        fetchData();
    }, []);

    

    return (
        <InventoryContext.Provider value={{ inventory, isRenderDone, setRenderDone, refreshFolders: fetchData }}>
          {children}
        </InventoryContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => useContext(InventoryContext);
