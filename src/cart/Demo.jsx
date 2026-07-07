import { useState, useEffect, useRef } from "react";
import { useCart } from "../public/cartContext";
import OutfitLayers from "../public/outfitLayers";
import styles from "./cart.module.css"
import watermark from "./../assets/wtm.png"
import loadingGif from "./../assets/loading.gif"

export default function Demo({ selectedOutFit }) {

    const { cart } = useCart()
    const outFit = cart[selectedOutFit];
    const [demoLoading, setDemoLoading] = useState(true);
    const demoRef = useRef(null);

    // Switching outfit sets swaps in a new stack of layer images — cover
    // just the board until the new layers are loaded, so it doesn't flash
    // half-loaded/broken images while they stream in.
    useEffect(() => {
        if (!outFit || !demoRef.current) {
            setDemoLoading(false);
            return;
        }

        setDemoLoading(true);

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

        // ponytail: fixed cutoff, same ceiling as the other reveal-when-ready gates
        const safetyTimeout = setTimeout(() => setDemoLoading(false), 4000);

        return () => {
            clearTimeout(safetyTimeout);
            pending.forEach((img) => {
                img.removeEventListener("load", onDone);
                img.removeEventListener("error", onDone);
            });
        };
    }, [outFit]);

    return (
        <div className={styles.board}>
            <div className={styles.demo} ref={demoRef}>

                <OutfitLayers outFit={outFit} />

                <img key="watermark" style={{ zIndex: 7 }}
                    src={watermark} alt={"watermark"}
                />

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
                        <img src={loadingGif} alt="Loading..." />
                    </div>
                )}
            </div>
        </div>
    )
}
