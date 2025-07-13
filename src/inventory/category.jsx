import Information from "./information";
import Image from "./image";
import Size from "./size";
import Extra from "./extra";

//This should be consider as a Category - Inventory already got filter out
export default function Category({ inventory, onImageLoad }) {
    
    const bowInventory = inventory.files.filter((item) => item.type === "bow");
    const tieInventory = inventory.files.filter((item) => item.type === "tie");
    const bagInventory = inventory.files.filter((item) => item.type === "bag");


    return (
        <>
            <Information inventory={inventory}/>

            {inventory.section === "extra" ?
                <Extra
                    bowInventory={bowInventory}
                    tieInventory={tieInventory}
                    bagInventory={bagInventory}
                    onImageLoad={onImageLoad}
                />
            : 
            <> 
                <Image
                    inventory={inventory.files}
                    section={inventory.section}
                    onImageLoad={onImageLoad}
                />
                <Size
                    inventory={inventory}
                    section={inventory.section}
                />
            </>

            }
        </>
    )
    
}