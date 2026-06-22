import { createContext, useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const InventoryContext = createContext()

const fetchInventory = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/inventory`, {
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  return data;
};

export const InventoryProvider = ({ children }) => {
  const [isRenderDone, setRenderDone] = useState(false)

  // Server state via React Query: caching, dedup and refetch for free.
  const { data: inventory = [], isLoading, error, refetch } = useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  });

  return (
    <InventoryContext.Provider value={{
      inventory,
      isLoading,
      error: error ? "Không thể tải dữ liệu. Vui lòng thử lại." : null,
      isRenderDone,
      setRenderDone,
      refreshFolders: refetch
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => useContext(InventoryContext);
