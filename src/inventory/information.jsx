
import { useOutfit } from "../public/outfitContext";
import styles from "./folder.module.css"

export default function Information({inventory}) {

    const { selectedItem } = useOutfit()

    if (!inventory) return

    return (
        <div className={styles.information}>
            <h3> {inventory.name} </h3>
            { sameSection(selectedItem, inventory) && renderItemAmount(selectedItem, inventory.section)}
        </div>
    )
}

const renderItemAmount = (selectedItem, section) => {

    const item = selectedItem[section].item
    if (!item) return

    const amount = item.amount
    if (!amount) return null

    return ( <p> Số lượng: {amount} </p> )
}

const sameSection = (selectedItem, inventory) => {

    const firstIteminInventory = inventory.files[0]
    if (!firstIteminInventory) return 
  
    const item = selectedItem[inventory.section].item
    if (!item) return
  
    if (item.type !== firstIteminInventory.type) return false
  
    return true
}