import Information from "./information";
import Image from "./image";
import Size from "./size";
import Extra from "./extra";

//This should be consider as a Category - Inventory already got filter out
export default function Category({ inventory, onImageLoad }) {

    return (
        <>
            <Information inventory={inventory}/>

            {inventory.section === "extra" ?
                <Extra
                    inventory={inventory}
                    section={inventory.section}
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