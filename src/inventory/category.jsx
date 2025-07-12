import { useEffect, useState, useRef } from "react";
import { useOutfit } from "../public/outfitContext";
import Information from "./information";
import Image from "./image";
import Size from "./size";
import Extra from "./extra";

//This should be consider as a Category - Inventory already got filter out
export default function Category({ inventory, resetTrigger, onImageLoad }) {
    
    const { missingSize, setMissingSize } = useOutfit()

    const [sizeSelected, setSizeSelected] = useState(null);

    useEffect(() => {
        setSizeSelected(null);
    }, [resetTrigger]);

      // Scroll to the item if its size is missing
    // useEffect(() => {

    //     if (!missingSize || !itemRef.current) return;

    //     if (missingSize.includes(inventory.section) && itemRef.current) {
    //         itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    //     }
        
    // }, [missingSize, inventory.section]);

    const bowInventory = inventory.files.filter((item) => item.type === "bow");
    const tieInventory = inventory.files.filter((item) => item.type === "tie");
    const bagInventory = inventory.files.filter((item) => item.type === "bag");


    return (
        <>
            <Information inventory={inventory}/>

            {inventory.section === "extra" ?
                <Extra
                    bowInventory={bowInventory}
                    tieInventory={tieInventory}
                    bagInventory={bagInventory}
                    resetTrigger={resetTrigger}
                    onImageLoad={onImageLoad}
                />
            : 
            <> 
                <Image
                    inventory={inventory.files}
                    section={inventory.section}
                    onImageLoad={onImageLoad}
                />
                <Size
                    inventory={inventory}
                    section={inventory.section}
                    sizeSelected={sizeSelected}
                    setSizeSelected={setSizeSelected}
                    missingSize={missingSize}
                    isMissingSize={missingSize ? missingSize.includes(inventory.section) : false}
                    setMissingSize={setMissingSize}
                />
            </>

            }
        </>
    )
    
}

// googleTrackingPickItem()
const googleTrackingPickItem = () => {
    
    let count = parseInt(sessionStorage.getItem('pickItem') || '0', 10);
    count++;
    sessionStorage.setItem('pickItem', count);

    return window.gtag('event', 'click', {
        event_category: 'Button',
        event_label: 'pick an item',
        click_count: count,
    });
}