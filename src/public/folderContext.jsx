import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const FolderContext = createContext()

export const FolderProvider = ({ children }) => {
    const [folder, setFolder] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/folder`, {
            headers: {
              "ngrok-skip-browser-warning": "true",
            }
          });
          setFolder(response.data);
        } catch (err) {
          console.error("fetch folder: " + err);
        } finally {
          setLoading(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <FolderContext.Provider value={{ folder, loading, refreshFolders: fetchData }}>
          {children}
        </FolderContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFolder = () => useContext(FolderContext);
