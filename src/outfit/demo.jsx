import styles from "./outfit.module.css"
import watermark from "./../assets/wtm.png"
import axios from "axios";
import { useState, useEffect } from "react";  
import { useAuth } from "../public/authContext"
import { Star, Dices } from 'lucide-react';

export default function Demo({outFit, setOutFit}) {


    const [filled, setFilled] = useState(false)
    const { user } = useAuth()

    const getDemoImages = (outFit) => {
        const images = [];

        if (!outFit) return
    
        // Loop through top-level keys
        for (const [key, value] of Object.entries(outFit)) {
            if (key === "total") continue;
    
            // If demo_image exists directly
            if (value?.item?.demo_image) {
                images.push({ key, image: value.item.demo_image, styleData: value });
            }
    
            // If it's the 'extra' category, loop its sub-categories
            if (key === "extra") {
                for (const [subKey, subValue] of Object.entries(value)) {
                    if (subValue?.item?.demo_image) {
                        images.push({ key: subKey, image: subValue.item.demo_image, styleData: subValue});
                    }
                }
            }
        }
    
        return images;
    };
    
    const selectedOutFit = outFit
        ? getDemoImages(outFit).map(({ key, image, styleData }, index) => (
          <img 
              key={`${key}-${index}`} 
              style={buttonStyle(styleData)} 
              src={image} 
              alt={key} 
          />
        ))
        : null;

    const addToFavorite = async (outFit) => {

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/favorite/add`,
                {   
                    outfit: outFit,
                    combination: JSON.stringify(getAllItem(outFit))
                },
                {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
            });

          } catch (err) {
            console.error("add favorite failed: " + err);
          } finally {
            setFilled(true)
          }
    }

    const getRandomFavoriteOutFit = async () => {

        try {

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/favorite`,
                {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
            });

            console.log(response.data) // how to handle if the api return [] but empty

            setOutFit(response.data.outfit)

          } catch (err) {
            console.error("get random favorite failed: " + err);
          } 
    }

    useEffect(() => {

        if (outFit) {
            setFilled(false)
        }

    }, [outFit])

    return (
        <div className={styles.board}>
            <div className={styles.demo}>

                {selectedOutFit?.length > 0 ? selectedOutFit : null}
                <img 
                    key="watermark"
                    style={{zIndex: 7}} 
                    src={watermark} 
                    alt={"watermark"} 
                />
            </div>

            <div className={styles.example}>
                {user && (
                    <Star
                        size={30}
                        fill={filled ? "yellow" : "none"}
                        onClick={() => addToFavorite(outFit)}
                        style={{ cursor: "pointer" }}
                    />
                )}
                <Dices
                    size={30}
                    onClick={getRandomFavoriteOutFit}
                    style={{ cursor: "pointer", }}
                />

            </div>
        </div>
    )
}

const buttonStyle = (value) => {

    return {
        zIndex: value.item.z_index || 0
    }
}

function getAllItem(outFit) {
    const allItem = [];

    Object.entries(outFit)
        .filter(([key]) => key !== "total" && key !== "id")
        .forEach(([section, value]) => {
            if (section === "extra") {
                const { neck, bag } = value;

                if (neck?.item) {
                    allItem.push({ id: neck.item.id });
                }

                if (bag?.item) {
                    allItem.push({ id: bag.item.id });
                }

                return;
            }

            if (value?.item) {
                allItem.push({
                    id: value.item.id,
                    size: value.size,
                });
            }
        });

    return allItem;
}