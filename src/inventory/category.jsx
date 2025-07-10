import { useEffect, useState, useRef } from "react";
import { useOutfit } from "../public/outfitContext";
import Information from "./information";
import Image from "./image";
import Size from "./size";
import styles from "./folder.module.css";
import Extra from "./extra";

//This should be consider as a Category
export default function Category({ inventory, updateSize, updateOutFit, 
        bottomSection, jacketSection, setBottomSection,
        setJacketSection, missingSize, setMissingSize, resetTrigger, onImageLoad }) {
    

    const itemRef = useRef(null);

    const { getSelectedItemBySection } = useOutfit();

    const [sizeSelected, setSizeSelected] = useState(null);

    const selectedItem = getSelectedItemBySection(inventory.section);

    const pickItem = (item, section) => {

        updateOutFit(item, section);

        googleTrackingPickItem() // it could represent a button click for pick or unpick item
    };

    useEffect(() => {

        if (!selectedItem) return 

        const section = inventory.section

        if (section === "bottom") setBottomSection(selectedItem.type);
 
        if (section === "jacket") setJacketSection(selectedItem.type);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItem]);

    useEffect(() => {

        const defaultItem = inventory.files[0]

        if (!defaultItem) return;

        const section = inventory.section

        if (section === "bottom") {

            const sameSectionbutDifferentKind = bottomSection !== defaultItem.type

            if (sameSectionbutDifferentKind) return setSizeSelected(null)

        }

        if (section === "jacket") {

            const sameSectionbutDifferentKind = jacketSection !== defaultItem.type

            if (sameSectionbutDifferentKind) return setSizeSelected(null)

        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bottomSection, jacketSection]);

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
                    name={inventory.name} 
                    section={inventory.section}
                    amount={bottomSection === inventory.files[0].type ? selectedItem?.amount : null} />
                <Image
                    name={inventory.name}
                    inventory={inventory.files}
                    section={inventory.section}
                    pickItem={pickItem}
                    selectedItem={selectedItem}
                    onImageLoad={onImageLoad}
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

    if (inventory.section === "jacket") {
        return (
            <div
                ref={itemRef}
                className={styles.item}
                style={{ opacity: jacketSection === null || jacketSection === inventory.files[0].type ? 1 : 0.5 }}
            >
                <Information 
                    name={inventory.name} 
                    section={inventory.section}
                    amount={jacketSection === inventory.files[0].type ? selectedItem?.amount : null} />
                <Image
                    name={inventory.name}
                    inventory={inventory.files}
                    section={inventory.section}
                    pickItem={pickItem}
                    selectedItem={selectedItem}
                    onImageLoad={onImageLoad}
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

    if (inventory.section === "extra") {

        const bowInventory = inventory.files.filter((item) => item.type === "bow");
        const tieInventory = inventory.files.filter((item) => item.type === "tie");
        const bagInventory = inventory.files.filter((item) => item.type === "bag");

        return (
            <Extra
                inventory={inventory}
                bowInventory={bowInventory}
                tieInventory={tieInventory}
                bagInventory={bagInventory}
                selectedItem={selectedItem}
                updateOutFit={updateOutFit}
                resetTrigger={resetTrigger}
                onImageLoad={onImageLoad}
            />
        );
        
    } 
     
    return (
        <div 
            ref={itemRef}
            className={styles.item}>
                <Information 
                    name={inventory.name} 
                    amount={selectedItem ? selectedItem?.amount : null} />
                <Image
                    name={inventory.name}
                    inventory={inventory.files}
                    section={inventory.section}
                    pickItem={pickItem}
                    selectedItem={selectedItem}
                    onImageLoad={onImageLoad}
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