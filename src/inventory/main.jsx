import { useRef } from "react";
import { useOutfit } from "../public/outfitContext";
import Category from "./category";
import styles from "./folder.module.css";

export default function Inventory({ inventory , onImageLoad}) {

    const { outFit } = useOutfit()

    const sorted = [...inventory].sort(
      (a, b) => sortOrder.indexOf(a.section) - sortOrder.indexOf(b.section)
    );

    const itemRef = useRef(null);


    return (
        sorted.map((inventory) => (

          <div key={inventory.id} ref={itemRef} className={styles.item} style={opacitySetup(outFit, inventory)}>

              <Category inventory={inventory} onImageLoad={onImageLoad} />

          </div>

        ))
    );
}

const sortOrder = ["top", "bottom", "sweater", "jacket", "extra"];

const opacitySetup = (outFit, inventory) => {

  const firstIteminInventory = inventory.files[0]
  if (!firstIteminInventory) return 

  const item = outFit[inventory.section].item
  if (!item) return

  if (item.type !== firstIteminInventory.type) return { opacity: 0.5 }

  return { opacity: 1 }
}
