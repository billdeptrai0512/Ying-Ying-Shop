import { useEffect, useState } from "react"
import styles from "./outfit.module.css"
import axios from "axios";
import Demo from "./demo";
import DeleteButton from "./delete";


export default function Favorite() {

    const [favorites, setFavorites] = useState([])
    const [reset, setReset] = useState(true)

    const fetchFavoriteDB = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/favorite`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching measurements for folder :`, error);
            return [];
        }
    };
    
    useEffect(() => {
        const loadFavorites = async () => {
            const favorites = await fetchFavoriteDB();
            setFavorites(favorites);
        };
    
        loadFavorites();
    }, [reset]);

    return (


        <div className={styles.body}>
            
            {favorites.map((object) => (
                <div key={object.id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
                    <DeleteButton id={object.id} setReset={setReset} />
                    <Demo outFit={object.outfit} />
                </div>
            ))}
        
        </div>


    

    );
  }

  