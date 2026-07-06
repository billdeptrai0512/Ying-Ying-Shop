import styles from "./outfit.module.css";
import Demo from "./demo.jsx";
import CheckOut from "./checkout.jsx";
import Inventory from "../inventory/main.jsx";
import loadingGif from "./../assets/loading.gif";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useInventory } from "../public/inventoryContext.jsx";

export default function Outfit() {
    const { inventory } = useInventory();
    const [showLoading, setShowLoading] = useState(true);
    const isDesktop = useMediaQuery({ query: "(min-width: 1400px)" });
    const containerRef = useRef(null);

    // Gate first paint on above-the-fold images only — anything below the
    // fold keeps its native loading="lazy" and loads as the user scrolls to it.
    useEffect(() => {
        if (!inventory.length || !containerRef.current) return;

        const imgs = Array.from(containerRef.current.querySelectorAll("img"));
        const viewportBottom = window.innerHeight;
        const pending = imgs.filter(
            (img) => img.getBoundingClientRect().top < viewportBottom && !img.complete
        );

        if (pending.length === 0) {
            setShowLoading(false);
            return;
        }

        let remaining = pending.length;
        const onDone = () => {
            remaining -= 1;
            if (remaining <= 0) setShowLoading(false);
        };
        pending.forEach((img) => {
            img.addEventListener("load", onDone, { once: true });
            img.addEventListener("error", onDone, { once: true });
        });

        // ponytail: fixed cutoff, not tied to actual connection speed — raise if slow networks flash a broken layout
        const safetyTimeout = setTimeout(() => setShowLoading(false), 4000);

        return () => {
            clearTimeout(safetyTimeout);
            pending.forEach((img) => {
                img.removeEventListener("load", onDone);
                img.removeEventListener("error", onDone);
            });
        };
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
    };

    return (
        <div className={styles.body} ref={containerRef}>
            <div style={loadingStyle}>
                <img src={loadingGif} alt="Loading..." />
            </div>

            {isDesktop ? (
                <>
                    <section className={styles.main}>
                        <Demo />
                    </section>
                    <section className={styles.primary}>
                        <Inventory inventory={leftInventory} />
                    </section>
                    <section className={styles.checkout} style={{ backgroundColor: "unset" }}>
                        <Inventory inventory={rightInventory} />
                        <CheckOut />
                    </section>
                </>
            ) : (
                <>
                    <section className={styles.main}>
                        <Demo />
                    </section>
                    <section className={styles.primary}>
                        <Inventory inventory={inventory} />
                    </section>
                    <section className={styles.checkout}>
                        <CheckOut />
                    </section>
                </>
            )}

        </div>
    );
}
