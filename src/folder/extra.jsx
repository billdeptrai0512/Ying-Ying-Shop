import { useState, useEffect} from "react"
import Information from "./information"
import Image from "./image"
import styles from "./folder.module.css"


export default function Extra({folderId, inventory, selectedItem, bowInventory, bagInventory, tieInventory, updateOutFit, resetTrigger}) {

    const [selectedBow, setSelectedBow] = useState(null)
    const [selectedBag, setSelectedBag] = useState(null)
    const [selectedTie, setSelectedTie] = useState(null)

    const pickItemBow = (item, section) => {

        if (selectedTie) setSelectedTie(null)

        setSelectedBow(selectedBow === item ? null : item);

        updateOutFit(item, section)

    }

    const pickItemTie = (item, section) => {

        if (selectedBow) setSelectedBow(null)

        setSelectedTie(selectedTie === item ? null : item);
        
        updateOutFit(item, section)

    }

    const pickItemBag = (item, section) => {

        setSelectedBag(selectedBag === item ? null : item);
        
        updateOutFit(item, section)

    }

    useEffect(() => {

        setSelectedBow(null)
        setSelectedBag(null)
        setSelectedTie(null)

    }, [resetTrigger])

    return (
        <div className={styles.item}>
                <Information 
                    folderId={folderId}
                    name={inventory.name} 
                    amount={selectedItem ? selectedItem.amount : null}
                />
                <Image 
                    name={inventory.name}
                    inventory={bowInventory}
                    section={inventory.section}
                    pickItem={pickItemBow}
                    selectedItem={selectedBow}
                />
                <Image 
                    name={inventory.name}
                    inventory={tieInventory}
                    section={inventory.section}
                    pickItem={pickItemTie}
                    selectedItem={selectedTie}
                />
                <Image 
                    name={inventory.name}
                    inventory={bagInventory}
                    section={inventory.section}
                    pickItem={pickItemBag}
                    selectedItem={selectedBag}
                />
        </div>  
    )
}