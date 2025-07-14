// Cleaned-up version of Demo component

import styles from "./outfit.module.css";
import watermark from "./../assets/wtm.png";
import axios from "axios";
import Imgix from "react-imgix";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../public/authContext";
import { useOutfit } from "../public/outfitContext";
import { Star, Dices } from "lucide-react";

export default function Demo() {
    const { user } = useAuth();
    const { outFit, setOutFit } = useOutfit();
    const [filled, setFilled] = useState(false);

    useEffect(() => {
        if (outFit) setFilled(false);
    }, [outFit]);

    const selectedOutfitImages = useMemo(() => {
        if (!outFit) return null;

        return getDemoImages(outFit)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(({ key, image, zIndex }, index) => (
                <div
                    key={`${key}-${index}`}
                    style={{
                        position: "absolute",
                        zIndex,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    >
                    <Imgix
                        src={image}
                        sizes="340px"
                        alt={key}
                        imgixParams={{ auto: "format,compress" }}
                        htmlAttributes={{ alt: "layer image" }}
                    />
                </div>
        ));
    }, [outFit]);

    const handleAddToFavorite = async () => {

        try {

            const favorite = {
                outfit: outFit,
                combination: JSON.stringify(getAllItem(outFit)),
            };

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/favorite/create`, favorite);

            } catch (err) {
                console.error("add favorite failed:", err);
            } finally {
                setFilled(true);
            }      
    };

    const handleRandomFavoriteOutfit = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/favorite/random`);
            setOutFit(response.data.outfit);
        } catch (err) {
            console.error("get random favorite failed:", err);
        } finally {
            googleTrackingRollADices();
        }
    };

    return (
        <div className={styles.board}>
                {user && (
                        <Star
                            size={30}
                            fill={filled ? "yellow" : "none"}
                            onClick={handleAddToFavorite}
                            style={{ cursor: "pointer" }}
                        />
                )}

            <div className={styles.demo}>
                {selectedOutfitImages}
                <img key="watermark" src={watermark} alt="watermark" style={{ zIndex: 7 }} />
            </div>

            <div className={styles.example}>
                <Dices
                size={30}
                onClick={handleRandomFavoriteOutfit}
                style={{ cursor: "pointer", alignSelf: "baseline", marginTop: 0, zIndex: 10 }}
                />
            </div>
        </div>
    );
}

function getDemoImages(outFit) {
  const images = [];
  if (!outFit) return images;

  for (const [key, value] of Object.entries(outFit)) {
    if (key === "total") continue;

    if (value?.item?.demo_image) {
      const demoImage = value.item.demo_image;
      const baseZIndex = value.item.z_index || 0;

      if (Array.isArray(demoImage)) {
        demoImage.forEach((img, idx) => {
          const zIndex = idx === 1 ? 6 : baseZIndex;
          images.push({ key: `${key}-${idx}`, image: img, zIndex });
        });
      } else {
        images.push({ key, image: demoImage, zIndex: baseZIndex });
      }
    }

    if (key === "extra") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subValue?.item?.demo_image) {
          images.push({
            key: subKey,
            image: subValue.item.demo_image[0],
            zIndex: subValue.item.z_index || 0,
          });
        }
      });
    }
  }

  return images;
}

function getAllItem(outFit) {
  const allItem = [];
  Object.entries(outFit)
    .filter(([key]) => key !== "total" && key !== "id")
    .forEach(([section, value]) => {
      if (section === "extra") {
        const { neck, bag } = value;
        if (neck?.item) allItem.push({ id: neck.item.id });
        if (bag?.item) allItem.push({ id: bag.item.id });
        return;
      }
      if (value?.item) {
        allItem.push({ id: value.item.id, size: value.size });
      }
    });
  return allItem;
}

function googleTrackingRollADices() {
  let count = parseInt(sessionStorage.getItem("randomOutFit") || "0", 10);
  count++;
  sessionStorage.setItem("randomOutFit", count);

  window.gtag("event", "roll a dices", {
    event_category: "Button",
    event_label: "Random Outfit",
    click_count: count,
  });
}