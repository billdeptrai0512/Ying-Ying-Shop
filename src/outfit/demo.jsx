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

        if (!outFit) return;

        // Loop through top-level keys
        for (const [key, value] of Object.entries(outFit)) {
            if (key === "total") continue;

            // If demo_image exists directly
            if (value?.item?.demo_image) {
                // Skip if demo_image is null
                if (value.item.demo_image === "null") continue;

                const demo_image = value.item.demo_image;
                const z_index = value.item.z_index || 0; // Ensure z_index has a default value

                if (!Array.isArray(demo_image)) {
                    images.push({ key, image: demo_image, styleData: { z_index } });
                }

                // If demo_image is an array, loop through it
                else {
                    demo_image.forEach((img, index) => {
                        if (index === 1) {
                            // modify for cổ áo thủy thủ 
                            // cân nhắc cho phép admin set z_index for each demo image // hoặc mặc định
                            images.push({ key: `${key}-${index}`, image: img, styleData: { z_index: 6 } });
                        } else {
                            images.push({ key: `${key}-${index}`, image: img, styleData: { z_index } });
                        }

                    });
                }
            }

            // If it's the 'extra' category, loop its sub-categories
            if (key === "extra") {
                for (const [subKey, subValue] of Object.entries(value)) {
                    if (subValue?.item?.demo_image) {
                        images.push({ key: subKey, image: subValue.item.demo_image, styleData: { z_index: subValue.item.z_index || 0 } });
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
              style={{ zIndex: styleData.z_index }} 
              src={image} 
              alt={key} 
          />
        ))
        : null;

    const addToFavorite = async (outFit) => {

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/favorite/add`,
                {   
                    // the outfit is just weird
                    // it doesn't get updated base on new change
                    // but does it hurt to not get update ? 
                    // basicaly it is to get the demo_imgae url
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
                //oh dame
            });

            console.log(response.data) // how to handle if the api return [] but empty

            setOutFit(response.data.outfit)

            // g2g analyst tracking

            let count = parseInt(sessionStorage.getItem('randomOutFit') || '0', 10);
            count++;
            sessionStorage.setItem('randomOutFit', count);

            window.gtag('event', 'roll a dices', {
                event_category: 'Button',
                event_label: 'Random Outfit',
                click_count: count,
            });


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
                    style={{ cursor: "pointer", alignSelf: "baseline", marginTop: "0em", zIndex: 10 }}
                />


            </div>
        </div>
    )
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