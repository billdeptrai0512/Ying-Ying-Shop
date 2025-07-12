import { useState, useEffect} from "react"
import Image from "./image"
import styles from "./folder.module.css"


export default function Extra({selectedItem, bowInventory, bagInventory, tieInventory, updateOutFit, resetTrigger, onImageLoad}) {

    const [selectedBow, setSelectedBow] = useState(null)
    const [selectedBag, setSelectedBag] = useState(null)
    const [selectedTie, setSelectedTie] = useState(null)

    useEffect(() => {

        if (!selectedItem) return

        if (selectedItem.bag) {
            setSelectedBag(selectedItem.bag)
        } else {
            setSelectedBag(null)
        }
      
        if (selectedItem.neck) {

            if (selectedItem.neck?.type === "bow") {

                setSelectedBow(selectedItem.neck);
                setSelectedTie(null)

            } else if (selectedItem.neck?.type === "tie") {

                setSelectedTie(selectedItem.neck);            
                setSelectedBow(null)
            }
        }

    }, [selectedItem])

      useEffect(() => {

        setSelectedBow(null)
        setSelectedBag(null)
        setSelectedTie(null)

    }, [resetTrigger])

    const pickItemBow = (item, section) => {
        if (selectedTie) setSelectedTie(null);
    
        const newSelection = selectedBow === item ? null : item;

        setSelectedBow(newSelection);
    
        if (newSelection !== selectedBow) updateOutFit(item, section);
    };
    
    const pickItemTie = (item, section) => {
        if (selectedBow) setSelectedBow(null);
    
        const newSelection = selectedTie === item ? null : item;

        setSelectedTie(newSelection);
    
        if (newSelection !== selectedTie) updateOutFit(item, section);

    };
    
    const pickItemBag = (item, section) => {
        if (selectedBag) setSelectedBag(null);

        const newSelection = selectedBag === item ? null : item;

        setSelectedBag(newSelection);
    
        if (newSelection !== selectedBag) updateOutFit(item, section);
        
    };

    return (
        <div className={styles.item}>
                <Image
                    inventory={bowInventory}
                    section={bowInventory.section}
                    pickItem={pickItemBow}
                    selectedItem={selectedBow}
                    onImageLoad={onImageLoad}
                />
                <Image 
                    inventory={tieInventory}
                    section={tieInventory.section}
                    pickItem={pickItemTie}
                    selectedItem={selectedTie}
                    onImageLoad={onImageLoad}
                />
                <Image 
                    inventory={bagInventory}
                    section={bagInventory.section}
                    pickItem={pickItemBag}
                    selectedItem={selectedBag}
                    onImageLoad={onImageLoad}
                />
        </div>  
    )
}