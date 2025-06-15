import { useEffect, useState, useRef } from "react";
import { useOutfit } from "../public/outfitContext";
import Information from "./information";
import Image from "./image";
import Size from "./size";
import styles from "./folder.module.css";
import Extra from "./extra";

export default function Item({ folderId, inventory, updateSize, updateOutFit, 
        bottomSection, jacketSection, setBottomSection,
        setJacketSection, missingSize, setMissingSize, resetTrigger }) {

    const { getSelectedItemBySection } = useOutfit();
    const [sizeSelected, setSizeSelected] = useState(null);
    const itemRef = useRef(null);
    const selectedItem = getSelectedItemBySection(inventory.section);

    const pickItem = (item, section) => {
        updateOutFit(item, section);
    };

    useEffect(() => {
        if (selectedItem && inventory.section === "bottom") {
          setBottomSection(selectedItem.type);
        }
    
        if (selectedItem && inventory.section === "jacket") {
          setJacketSection(selectedItem.type);
        }
    }, [selectedItem, inventory.section, setBottomSection, setJacketSection]);

    useEffect(() => {
        if (!inventory.files[0]) return;

        if (inventory.section === "bottom" && bottomSection !== inventory.files[0].type) {
            setSizeSelected(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bottomSection]);

    useEffect(() => {
        if (!inventory.files[0]) return;

        if (inventory.section === "jacket" && jacketSection !== inventory.files[0].type) {
            setSizeSelected(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jacketSection]);

    useEffect(() => {
        setSizeSelected(null);
    }, [resetTrigger]);

      // Scroll to the item if its size is missing
    useEffect(() => {

        if (!missingSize || !itemRef.current) return;

        if (missingSize.includes(inventory.section) && itemRef.current) {
            itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        
    }, [missingSize, inventory.section]);


    if (inventory.section === "bottom") {
        return (
            <div
                ref={itemRef}
                className={styles.item}
                style={{ opacity: bottomSection === null || bottomSection === inventory.files[0].type ? 1 : 0.5 }}
            >
                <Information 
                    folderId={folderId} 
                    name={inventory.name} 
                    section={inventory.section}
                    amount={bottomSection === inventory.files[0].type ? selectedItem.amount : null} />
                <Image
                    name={inventory.name}
                    inventory={inventory.files}
                    section={inventory.section}
                    pickItem={pickItem}
                    selectedItem={selectedItem}
                />
                <Size
                    inventory={inventory}
                    section={inventory.section}
                    selectedItem={selectedItem}
                    sizeSelected={sizeSelected}
                    updateSize={updateSize}
                    setSizeSelected={setSizeSelected}
                    missingSize={missingSize}
                    isMissingSize={missingSize ? missingSize.includes(inventory.section) : false}
                    setMissingSize={setMissingSize}
                />
            </div>
        );
    } else if (inventory.section === "jacket") {
        return (
            <div
                ref={itemRef}
                className={styles.item}
                style={{ opacity: jacketSection === null || jacketSection === inventory.files[0].type ? 1 : 0.5 }}
            >
                <Information 
                    folderId={folderId} 
                    name={inventory.name} 
                    section={inventory.section}
                    amount={jacketSection === inventory.files[0].type ? selectedItem.amount : null} />
                <Image
                    name={inventory.name}
                    inventory={inventory.files}
                    section={inventory.section}
                    pickItem={pickItem}
                    selectedItem={selectedItem}
                />
                <Size
                    inventory={inventory}
                    section={inventory.section}
                    selectedItem={selectedItem}
                    sizeSelected={sizeSelected}
                    updateSize={updateSize}
                    setSizeSelected={setSizeSelected}
                    missingSize={missingSize}
                    isMissingSize={missingSize ? missingSize.includes(inventory.section) : false}
                    setMissingSize={setMissingSize}
                />
            </div>
        );
    } else if (inventory.section === "extra") {
        const bowInventory = inventory.files.filter((item) => item.type === "bow");
        const tieInventory = inventory.files.filter((item) => item.type === "tie");
        const bagInventory = inventory.files.filter((item) => item.type === "bag");

        return (
            <Extra
                folderId={folderId}
                inventory={inventory}
                bowInventory={bowInventory}
                tieInventory={tieInventory}
                bagInventory={bagInventory}
                selectedItem={selectedItem}
                updateOutFit={updateOutFit}
                resetTrigger={resetTrigger}
            />
        );
    } else {
        return (
            <div 
                ref={itemRef}
                className={styles.item}>
                <Information 
                    folderId={folderId} 
                    name={inventory.name} 
                    amount={selectedItem ? selectedItem.amount : null} />
                <Image
                    name={inventory.name}
                    inventory={inventory.files}
                    section={inventory.section}
                    pickItem={pickItem}
                    selectedItem={selectedItem}
                />
                <Size
                    inventory={inventory}
                    section={inventory.section}
                    selectedItem={selectedItem}
                    sizeSelected={sizeSelected}
                    updateSize={updateSize}
                    setSizeSelected={setSizeSelected}
                    missingSize={missingSize}
                    isMissingSize={missingSize ? missingSize.includes(inventory.section) : false}
                    setMissingSize={setMissingSize}
                />
            </div>
        );
    }
}