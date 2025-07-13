import React, { useRef, useEffect } from "react";
import { useOutfit } from "../public/outfitContext";
import Category from "./category";
import styles from "./folder.module.css";

export default function Inventory({ inventory , onImageLoad}) {

    const { outFit, missingSizes } = useOutfit()

    const sorted = [...inventory].sort(
      (a, b) => sortOrder.indexOf(a.section) - sortOrder.indexOf(b.section)
    );

    const itemRefs = useRef({});
      // Scroll to the item if its size is missing
      useEffect(() => {

        if (!missingSizes || !itemRefs.current) return;

        for (const section of sortOrder) {
            if (missingSizes.includes(section)) {
                const ref = itemRefs.current[section]?.current;

                if (ref) {
                    ref.scrollIntoView({ behavior: "smooth", block: "center" });
                    break;
                }
            }
        }
    }, [missingSizes]);

    

    return (
      sorted.map((inventory) => {
          const section = inventory.section;
      
          if (!itemRefs.current[section]) {
            itemRefs.current[section] = React.createRef();
          }
      
          return (
            <div
              key={inventory.id}
              ref={itemRefs.current[section]}
              className={styles.item}
              style={opacitySetup(outFit, inventory)}
            >
              <Category
                inventory={inventory}
                onImageLoad={onImageLoad}
              />
            </div>
          );
      })
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
