import { useRef } from "react";
import { useOutfit } from "../public/outfitContext";
import Category from "./category";
import styles from "./folder.module.css";

export default function Inventory({ inventory , onImageLoad}) {

    const { selectedItem } = useOutfit()

    const sorted = [...inventory].sort(
      (a, b) => sortOrder.indexOf(a.section) - sortOrder.indexOf(b.section)
    );

    const itemRef = useRef(null);


    return (
        sorted.map((inventory) => (

          <div ref={itemRef} className={styles.item} style={opacitySetup(selectedItem, inventory)}>

              <Category inventory={inventory} onImageLoad={onImageLoad} />

          </div>

        ))
    );
}

const sortOrder = ["top", "bottom", "sweater", "jacket", "extra"];

const opacitySetup = (selectedItem, inventory) => {

  const firstIteminInventory = inventory.files[0]
  if (!firstIteminInventory) return 

  const item = selectedItem[inventory.section].item
  if (!item) return

  if (item.type !== firstIteminInventory.type) return { opacity: 0.5 }

  return { opacity: 1 }
}
