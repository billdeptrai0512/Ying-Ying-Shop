import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const FolderContext = createContext()

export const FolderProvider = ({ children }) => {
    const [folder, setFolder] = useState([])

    const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:3000");
          setFolder(response.data.folder);
        } catch (err) {
          console.error("fetch folder: " + err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <FolderContext.Provider value={{ folder, refreshFolders: fetchData }}>
          {children}
        </FolderContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFolder = () => useContext(FolderContext);
