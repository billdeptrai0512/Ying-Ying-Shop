import styles from "./outfit.module.css";
import Demo from "./demo.jsx";
import CheckOut from "./checkout.jsx";
import Inventory from "../inventory/main.jsx";
import loadingGif from "./../assets/loading.gif";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useInventory } from "../public/inventoryContext.jsx";
import { useOutfit } from "../public/outfitContext";
import Header from "../header/main.jsx";

export default function Outfit() {
    const { setOutFit, setSelectedItem } = useOutfit();
    const { inventory, isRenderDone, setRenderDone } = useInventory();

    const [bottomSection, setBottomSection] = useState(null);
    const [jacketSection, setJacketSection] = useState(null);
    const [missingSize, setMissingSize] = useState(null);
    const [resetTrigger, setResetTrigger] = useState(false);
    const isDesktop = useMediaQuery({ query: "(min-width: 1400px)" });

    const resetOutfit = () => {
        setOutFit({
            id: Math.random(),
            top: { item: null, size: null },
            bottom: { item: null, size: null },
            sweater: { item: null, size: null },
            jacket: { item: null, size: null },
            extra: {
                neck: { item: null },
                bag: { item: null },
            },
            total: 0,
        });

        setSelectedItem(null);
        setBottomSection(null);
        setJacketSection(null);
        setMissingSize(null);
        setResetTrigger((prev) => !prev);
    };

    // Optional: restore body style after render
    const imageCount = useRef(0);
    const imagesLoaded = useRef(0);
    const renderLabel = useRef(null);
    useEffect(() => {
        if (!inventory || !Array.isArray(inventory)) return;
    
        // Compute total number of images
        const totalImages = inventory.reduce((sum, section) => sum + (section.files?.length || 0), 0);
    
        if (totalImages === 0) return;
    
        imageCount.current = totalImages;
        imagesLoaded.current = 0;
    
        // Update label dynamically
        renderLabel.current = `images-rendered-${Date.now()}`;
    
        console.time(renderLabel.current);
        
        return () => {
            // Optional cleanup
            console.timeEnd(renderLabel.current);
            setRenderDone(true);
        };

    }, [inventory, setRenderDone]);

    const handleImageLoad = () => {
        imagesLoaded.current += 1;
    
        if (imagesLoaded.current === imageCount.current) {
            console.timeEnd(renderLabel.current); // ✅ Now the label matches
        }
    };


    const leftInventory = inventory.filter((category) =>
        ["top", "bottom", "sweater"].includes(category.section)
    );
    const rightInventory = inventory.filter((category) =>
        ["jacket", "extra"].includes(category.section)
    );



    return (
        <>
            {/* 🔄 Always Render UI, Just Hide It If Not Ready */}
                {!isRenderDone && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "#fff",
                            display: isRenderDone ? "none" : "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 9999,
                        }}
                    >
                        <img src={loadingGif} alt="Loading..." />
                    </div>
                )}

                {isDesktop ? (
                    <>
                        <section className={styles.main}><Demo /></section>
                        <section className={styles.primary}>
                            <Inventory
                                inventory={leftInventory}
                                missingSize={missingSize}
                                setMissingSize={setMissingSize}
                                bottomSection={bottomSection}
                                setBottomSection={setBottomSection}
                                resetTrigger={resetTrigger}
                                onImageLoad={handleImageLoad}
                            />
                        </section>
                        <section className={styles.checkout} style={{ backgroundColor: "unset" }}>
                            <Inventory
                                inventory={rightInventory}
                                missingSize={missingSize}
                                setMissingSize={setMissingSize}
                                jacketSection={jacketSection}
                                setJacketSection={setJacketSection}
                                resetTrigger={resetTrigger}
                                onImageLoad={handleImageLoad}
                            />
                            <CheckOut
                                setMissingSize={setMissingSize}
                                resetOutfit={resetOutfit}
                            />
                        </section>
                    </>
                ) : (
                    <>
                        <section className={styles.main}><Demo /></section>
                        <section className={styles.primary}>
                            <Inventory
                                inventory={inventory}
                                missingSize={missingSize}
                                setMissingSize={setMissingSize}
                                bottomSection={bottomSection}
                                jacketSection={jacketSection}
                                setBottomSection={setBottomSection}
                                setJacketSection={setJacketSection}
                                resetTrigger={resetTrigger}
                            />
                        </section>
                        <section className={styles.checkout}>
                            <CheckOut
                                setMissingSize={setMissingSize}
                                resetOutfit={resetOutfit}
                            />
                        </section>
                    </>
                )}

            {/* 👀 Loading Overlay */}

        </>
    );
}
