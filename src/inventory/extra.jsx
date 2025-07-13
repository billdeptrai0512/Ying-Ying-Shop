import Image from "./image"
import styles from "./folder.module.css"


export default function Extra({ inventory, section}) {

    const bowInventory = inventory.files.filter((item) => item.type === "bow");
    const tieInventory = inventory.files.filter((item) => item.type === "tie");
    const bagInventory = inventory.files.filter((item) => item.type === "bag");


    return (
        <div className={styles.item}>
            <Image
                inventory={bowInventory}
                section={section}
                extraType={"neck"}
            />
            <Image 
                inventory={tieInventory}
                section={section}
                extraType={"neck"}
            />
            <Image 
                inventory={bagInventory}
                section={section}
                extraType={"bag"}
            />
        </div>  
    )
}