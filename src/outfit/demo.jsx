// Cleaned-up version of Demo component

import styles from "./outfit.module.css";
import watermark from "./../assets/wtm.png";
import loadingGif from "./../assets/loading.gif";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../public/authContext";
import { useOutfit } from "../public/outfitContext";
import OutfitLayers from "../public/outfitLayers";
import { Star, Dices } from "lucide-react";

export default function Demo() {
  const { user } = useAuth();
  const { outFit, setOutFit } = useOutfit();
  const [filled, setFilled] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const demoRef = useRef(null);
  const isFetchingRef = useRef(false);

  // outFit is restored from sessionStorage (see outfitContext), so only
  // roll a random one on a genuinely fresh session — otherwise navigating
  // away (e.g. to /cart) and back would remount Demo and discard whatever
  // outfit the user was customizing.
  useEffect(() => {
    if (!outFit?.total) handleRandomFavoriteOutfit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {

    if (outFit) setFilled(false);

  }, [outFit]);

  // Re-rolling swaps in a new set of layer images — cover just the board
  // (not the whole page) until the new layers are loaded, so it doesn't
  // flash half-loaded/broken images while they stream in. demoLoading is
  // switched on as soon as the click fires (see handleRandomFavoriteOutfit),
  // this effect only decides when it's safe to switch back off.
  useEffect(() => {
    if (!outFit || !demoRef.current) return;

    const imgs = Array.from(demoRef.current.querySelectorAll("img"));
    const pending = imgs.filter((img) => !img.complete);

    if (pending.length === 0) {
      setDemoLoading(false);
      return;
    }

    let remaining = pending.length;
    const onDone = () => {
      remaining -= 1;
      if (remaining <= 0) setDemoLoading(false);
    };
    pending.forEach((img) => {
      img.addEventListener("load", onDone, { once: true });
      img.addEventListener("error", onDone, { once: true });
    });

    // ponytail: fixed cutoff, same ceiling as the page-level gate
    const safetyTimeout = setTimeout(() => setDemoLoading(false), 4000);

    return () => {
      clearTimeout(safetyTimeout);
      pending.forEach((img) => {
        img.removeEventListener("load", onDone);
        img.removeEventListener("error", onDone);
      });
    };
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
    // ref, not state — state updates are batched/async, so two clicks in the
    // same tick (double-click) would both read the old value and both slip
    // through, firing overlapping requests whose responses can resolve out
    // of order and land on the wrong outfit.
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setSpinning(true);
    setDemoLoading(true);
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
      setDemoLoading(false);
    } finally {
      isFetchingRef.current = false;
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

      <div className={styles.demo} ref={demoRef}>
        <OutfitLayers outFit={outFit} />
        <img key="watermark" src={watermark} alt="watermark" style={{ zIndex: 7 }} />
        {demoLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#F0E4E2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 20,
            }}
          >
            <img
              src={loadingGif}
              alt="Loading..."
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}
      </div>

      <div className={styles.example}>
        <Dices
          size={30}
          onClick={handleRandomFavoriteOutfit}
          className={spinning ? styles.dicesSpin : styles.dicesWiggle}
          onAnimationEnd={() => setSpinning(false)}
          style={{
            alignSelf: "baseline",
            marginTop: 0,
            zIndex: 10,
            visibility: demoLoading ? "hidden" : "visible",
          }}
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