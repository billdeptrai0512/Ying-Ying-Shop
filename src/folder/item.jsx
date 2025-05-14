import { useEffect, useState } from "react"
import Information from "./information"
import Image from "./image"
import Size from "./size"
import styles from "./folder.module.css"

export default function Item({folderId, inventory, 
                                UpdateSize, UpdateOutFit, 
                                bottomSection, jacketSection,
                                missingSize , setMissingSize, resetTrigger}) {

    const [selectedItem, setSelectedItem] = useState(null)
    const [sizeSelected, setSizeSelected] = useState(null)

    const pickItem = (item, section) => {

        setSelectedItem(selectedItem === item ? null : item);
        
        UpdateOutFit(item, section)
    }

    // these effect basically set all selected item to null.

    useEffect(() => {

        if (inventory.section === "bottom" && bottomSection !== inventory.files[0].type) {
            setSelectedItem(null);
        }

    }, [bottomSection])

    useEffect(() => {

        if (inventory.section === "jacket" && jacketSection !== inventory.files[0].type) {
            setSelectedItem(null);
        }

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
                        itemSection={inventory.section} 
                        selectedItem={selectedItem}
                    />
                    <Image 
                        name={inventory.name}
                        inventory={inventory.files}
                        section={inventory.section}
                        pickItem={pickItem}
                        selectedItem={selectedItem}
                    />
                    <Size 
                        section={inventory.section}
                        selectedItem={selectedItem}
                        sizeSelected={sizeSelected}
                        UpdateSize={UpdateSize}
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
                        itemSection={inventory.section} 
                        selectedItem={selectedItem}
                    />
                    <Image 
                        name={inventory.name}
                        inventory={inventory.files}
                        section={inventory.section}
                        pickItem={pickItem}
                        selectedItem={selectedItem}
                    />
                    <Size 
                        section={inventory.section}
                        selectedItem={selectedItem}
                        sizeSelected={sizeSelected}
                        UpdateSize={UpdateSize}
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
        const bagInventory = inventory.files.filter(item => item.type === "bag")

        return (
            <div className={styles.item}>
                    <Information 
                        folderId={folderId}
                        name={inventory.name} 
                        itemSection={inventory.section} 
                        selectedItem={selectedItem}
                    />
                    <Image 
                        name={inventory.name}
                        inventory={bowInventory}
                        section={inventory.section}
                        pickItem={pickItem}
                        selectedItem={selectedItem}
                    />
                    <Image 
                        name={inventory.name}
                        inventory={bagInventory}
                        section={inventory.section}
                        pickItem={pickItem}
                        selectedItem={selectedItem}
                    />
            </div>  
        )

    } else {

        return (
            <div className={styles.item}>
                <Information 
                    folderId={folderId}
                    name={inventory.name} 
                    itemSection={inventory.section} 
                    selectedItem={selectedItem}
                />
                <Image 
                    name={inventory.name}
                    inventory={inventory.files}
                    section={inventory.section}
                    pickItem={pickItem}
                    selectedItem={selectedItem}
                />
                <Size 
                    section={inventory.section}
                    selectedItem={selectedItem}
                    sizeSelected={sizeSelected}
                    UpdateSize={UpdateSize}
                    setSizeSelected={setSizeSelected}
                    missingSize={missingSize}
                    isMissingSize={missingSize ? missingSize.includes(inventory.section) : false}
                    setMissingSize={setMissingSize}
                />
            </div>    
        )
    }

}