import { useEffect, useState } from "react"
import Information from "./information"
import Image from "./image"
import Size from "./size"
import styles from "./Item.module.css"

export default function Item({folderId, inventory, UpdateSize, UpdateOutFit, setChoosen, isChoosen, missingSize , setMissingSize, resetTrigger}) {

    const [selectedItem, setSelectedItem] = useState(null)
    const [sizeSelected, setSizeSelected] = useState(null)

    const pickItem = (index, inventory) => {

        const selected = inventory[index]

        const category = inventory.type

        // const zIndex = props.zIndex

        setSelectedItem(selectedItem === selected ? null : selected);
        
        UpdateOutFit(selected, category)

        setChoosen ? setChoosen(selected.section) : null

    }
    
    // useEffect(() => {

    //     if (isChoosen !== inventory.files[0].section) {
    //         setSelectedItem(null)
    //     }

    // }, [isChoosen, inventory.files])

    useEffect(() => {

        setSelectedItem(null)
        
    }, [resetTrigger])


    return (
        <div className={styles.item} style={{ opacity: isChoosen === null || isChoosen === inventory.section ? 1 : 0.5 }}>
            <Information 
                folderId={folderId}
                name={inventory.name} 
                itemSection={inventory.section} 
                selectedItem={selectedItem}
                isChoosen={isChoosen} 
            />
            <Image 
                name={inventory.name}
                inventory={inventory.files}
                pickItem={pickItem}
                selectedItem={selectedItem}
            />
            {/* <Size 
                category={inventory.type}
                selectedItem={selectedItem}
                isChoosen={isChoosen} 
                itemSection={itemSection}
                sizeSelected={sizeSelected}
                UpdateSize={UpdateSize}
                setSizeSelected={setSizeSelected}
                missingSize={missingSize}
                // isMissingSize={missingSize ? missingSize.includes(inventory.type) : false}
                // setMissingSize={setMissingSize}
            /> */}
        </div>     
    )
}