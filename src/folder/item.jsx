import { useEffect, useState } from "react"
import Information from "./information"
import Image from "./image"
import Size from "./size"
import styles from "./folder.module.css"
import Extra from "./extra"


export default function Item({folderId, inventory, 
                                updateSize, updateOutFit, 
                                bottomSection, jacketSection,
                                missingSize , setMissingSize, resetTrigger}) {

    const [selectedItem, setSelectedItem] = useState(null)
    const [sizeSelected, setSizeSelected] = useState(null)

    const pickItem = (item, section) => {

        setSelectedItem(selectedItem === item ? null : item);
        
        updateOutFit(item, section)
    }

    // these effect basically set all selected item to null.

    useEffect(() => {

        if (!inventory.files[0]) return

        if (inventory.section === "bottom" && bottomSection !== inventory.files[0].type) {
            setSelectedItem(null);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bottomSection])

    useEffect(() => {

        if (!inventory.files[0]) return

        if (inventory.section === "jacket" && jacketSection !== inventory.files[0].type) {
            setSelectedItem(null);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jacketSection])

    useEffect(() => {

        setSelectedItem(null)
        
    }, [resetTrigger])

    if (inventory.section === "bottom") {

        return (
            <div className={styles.item} 
            style={{ opacity: bottomSection === null || bottomSection === inventory.files[0].type ? 1 : 0.5 }}
                    >
                    <Information 
                        folderId={folderId}
                        name={inventory.name} 
                        amount={selectedItem ? selectedItem.amount : null}
                    />
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
        )

    } else if (inventory.section === "jacket") {

        return (
            <div className={styles.item} 
            style={{ opacity: jacketSection === null || jacketSection === inventory.files[0].type ? 1 : 0.5 }}
                    >
                    <Information 
                        folderId={folderId}
                        name={inventory.name} 
                        amount={selectedItem ? selectedItem.amount : null}
                    />
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
        )

    } else if (inventory.section === "extra") {

        //filter section inside inventory.files for bag + bow
        const bowInventory = inventory.files.filter(item => item.type === "bow")
        const tieInventory = inventory.files.filter(item => item.type === "tie")
        const bagInventory = inventory.files.filter(item => item.type === "bag")

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
        )

    } else {

        return (
            <div className={styles.item}>
                <Information 
                    folderId={folderId}
                    name={inventory.name} 
                    amount={selectedItem ? selectedItem.amount : null}
                />
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
        )
    }

}