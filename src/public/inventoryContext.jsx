import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const InventoryContext = createContext()

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRenderDone, setRenderDone] = useState(false)

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/inventory`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        }
      });
      setInventory(response.data);
    } catch (err) {
      console.error("fetch folder: " + err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <InventoryContext.Provider value={{
      inventory,
      isLoading,
      error,
      isRenderDone,
      setRenderDone,
      refreshFolders: fetchData
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => useContext(InventoryContext);
