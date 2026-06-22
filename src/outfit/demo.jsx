// Cleaned-up version of Demo component

import styles from "./outfit.module.css";
import watermark from "./../assets/wtm.png";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../public/authContext";
import { useOutfit } from "../public/outfitContext";
import OutfitLayers from "../public/outfitLayers";
import { Star, Dices } from "lucide-react";

export default function Demo() {
  const { user } = useAuth();
  const { outFit, setOutFit } = useOutfit();
  const [filled, setFilled] = useState(false);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    handleRandomFavoriteOutfit()
  }, [])

  useEffect(() => {

    if (outFit) setFilled(false);

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
    setSpinning(true);
    try {
      console.log("Fetching random favorite outfit...");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/favorite/random`);
      console.log("Random outfit response:", response.data);
      setOutFit(response.data.outfit);
    } catch (err) {
      console.error("fetch /favorite/random failed:", err);
      if (err.response) {
        console.error("Server responded with:", err.response.status, err.response.data);
      }
    } finally {
      setSpinning(false);
      try {
        googleTrackingRollADices();
      } catch (e) {
        console.error("google tracking failed", e);
      }
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
        <OutfitLayers outFit={outFit} />
        <img key="watermark" src={watermark} alt="watermark" style={{ zIndex: 7 }} />
      </div>

      <div className={styles.example}>
        <Dices
          size={30}
          onClick={handleRandomFavoriteOutfit}
          className={spinning ? styles.dicesSpin : styles.dicesWiggle}
          onAnimationEnd={() => setSpinning(false)}
          style={{ alignSelf: "baseline", marginTop: 0, zIndex: 10 }}
        />
      </div>
    </div>
  );
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

  if (typeof window.gtag === "function") {
    window.gtag("event", "roll a dices", {
      event_category: "Button",
      event_label: "Random Outfit",
      click_count: count,
    });
  }
}