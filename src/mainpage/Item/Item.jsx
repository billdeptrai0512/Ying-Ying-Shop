import { useEffect, useState } from "react"
import Information from "./element/Information"
import Image from "./element/Image"
import Size from "./element/Size"
import styles from "./Item.module.css"

export default function Item({props, UpdateSize, UpdateOutFit, setChoosen, isChoosen, missingSize , setMissingSize, resetTrigger}) {

    const [selectedItem, setSelectedItem] = useState(null)
    const [sizeSelected, setSizeSelected] = useState(null)

    const pickItem = (index, inventory) => {

        const selected = inventory[index]

        const category = props.type

        const zIndex = props.zIndex

        setSelectedItem(selectedItem === selected ? null : selected);
        
        UpdateOutFit(selected, category, zIndex)

        setChoosen ? setChoosen(selected.section) : null

    }
    
    useEffect(() => {

        if (isChoosen !== props.inventory[0].section) {
            setSelectedItem(null)
        }

    }, [isChoosen, props.inventory])

    useEffect(() => {

        setSelectedItem(null)
        
    }, [resetTrigger])

    const itemSection = props.inventory[0].section

    return (
        <div className={styles.item} style={{ opacity: isChoosen === null || isChoosen === itemSection ? 1 : 0.5 }}>
            <Information 
                name={props.name} 
                selectedItem={selectedItem}
                isChoosen={isChoosen} 
                itemSection={itemSection} 
            />
            <Image 
                name={props.name}
                inventory={props.inventory}
                pickItem={pickItem}
                selectedItem={selectedItem}
            />
            <Size 
                category={props.type}
                selectedItem={selectedItem}
                isChoosen={isChoosen} 
                itemSection={itemSection}
                sizeSelected={sizeSelected}
                UpdateSize={UpdateSize}
                setSizeSelected={setSizeSelected}
                missingSize={missingSize}
                isMissingSize={missingSize ? missingSize.includes(props.type) : false}
                setMissingSize={setMissingSize}
            />
        </div>     
    )
}