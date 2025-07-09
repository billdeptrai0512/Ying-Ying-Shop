import styles from "./outfit.module.css";
import Demo from "./demo.jsx";
import CheckOut from "./checkout.jsx";
import Inventory from "../inventory/main.jsx";

import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useInventory } from "../public/inventoryContext.jsx";
import { useOutfit } from "../public/outfitContext";


//what are we trying to achive in this component ?
//we trying to define the layout for the whole page depend on mobile and desktop

export default function Outfit() {
    
    const { setOutFit, setSelectedItem } = useOutfit();
    const { inventory, loading } = useInventory();

    const [bottomSection, setBottomSection] = useState(null);
    const [jacketSection, setJacketSection] = useState(null);

    // this state share with checkout button to notify user to enter
    const [missingSize, setMissingSize] = useState(null); 
    const [resetTrigger, setResetTrigger] = useState(false);
    // this state share with inventory to reset default of everything including 

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

        setSelectedItem(null); // Reset selected item
        setBottomSection(null);
        setJacketSection(null);
        setMissingSize(null);

        setResetTrigger((prev) => !prev);
    };

    //loading is need here to lazy loading the whole page 
    if (loading) return <p>hello nigga</p>

    if (isDesktop) {

        const leftInventory = inventory.filter((category) => {
            return (
                category.section === "top" ||
                category.section === "bottom" ||
                category.section === "sweater"
            );
        });

        const rightInventory = inventory.filter((category) => {
            return (
                category.section === "jacket" || 
                category.section === "extra"
            );
        });

        return (
            <>
                <section className={styles.main}>
                    <Demo />
                </section>
                <section className={styles.primary}>
                    <Inventory
                        inventory={leftInventory}
                        missingSize={missingSize}
                        setMissingSize={setMissingSize}
                        bottomSection={bottomSection}
                        setBottomSection={setBottomSection}
                        resetTrigger={resetTrigger}
                    />
                </section>
                <section className={styles.checkout} style={{backgroundColor: "unset"}}>
                    <Inventory
                        inventory={rightInventory}
                        missingSize={missingSize}
                        setMissingSize={setMissingSize}
                        jacketSection={jacketSection}
                        setJacketSection={setJacketSection}
                        resetTrigger={resetTrigger}
                    />
                    <CheckOut
                        setMissingSize={setMissingSize}
                        resetOutfit={resetOutfit}
                    />
                </section>
            </>
        );
    }
    // Mobile view
    return (
        <>
            <section className={styles.main}>
                <Demo />
            </section>
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
    );
}



