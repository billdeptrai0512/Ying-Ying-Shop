import styles from "./outfit.module.css";
import Demo from "./demo.jsx";
import CheckOut from "./checkout.jsx";
import Inventory from "../inventory/main.jsx";
import loadingGif from "./../assets/loading.gif";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useInventory } from "../public/inventoryContext.jsx";

export default function Outfit() {
    const { inventory, setRenderDone } = useInventory();
    const [showLoading, setShowLoading] = useState(true);
    const isDesktop = useMediaQuery({ query: "(min-width: 1400px)" });

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

    useEffect(() => {
        console.log('start')

        const timeout = setTimeout(() => {
          setShowLoading(false);
          console.log('end')
        }, inventory.length !== 0 ? 500 : 3000); // 3 seconds
      
        return () => clearTimeout(timeout); // Cleanup

    }, [inventory]);


    const leftInventory = inventory.filter((category) =>
        ["top", "bottom", "sweater"].includes(category.section)
    );
    const rightInventory = inventory.filter((category) =>
        ["jacket", "extra"].includes(category.section)
    );

    const loadingStyle = {

        position: "fixed",
        inset: 0,
        backgroundColor: "#fff",
        display: showLoading ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,

    } 
          {/* <div className={styles.body}> 
        <Outlet />
      </div> */}

    return (
        <div className={styles.body}> 
            {/* 🔄 Always Render UI, Just Hide It If Not Ready */}
                
                <div style={loadingStyle}>
                    <img src={loadingGif} alt="Loading..." />
                </div>
            
                {isDesktop ? (
                    <>
                        <section className={styles.main}>
                            <Demo />
                        </section>
                        <section className={styles.primary}>
                            <Inventory
                                inventory={leftInventory}
                                onImageLoad={handleImageLoad}
                            />
                        </section>
                        <section className={styles.checkout} style={{ backgroundColor: "unset" }}>
                            <Inventory
                                inventory={rightInventory}
                                onImageLoad={handleImageLoad}
                            />
                            <CheckOut />
                        </section>
                    </>
                ) : (
                    <>
                        <section className={styles.main}><Demo /></section>
                        <section className={styles.primary}>
                            <Inventory
                                inventory={inventory}
                                onImageLoad={handleImageLoad}
                            />
                        </section>
                        <section className={styles.checkout}>
                            <CheckOut/>
                        </section>
                    </>
                )}

        </div>
    );
}
