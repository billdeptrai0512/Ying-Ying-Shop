import styles from "./checkout.module.css"
import watermark from "./../assets/wtm.png"

export default function Demo({cart, selectedOutFit}) {

    const getDemoImages = (cart, selectedOutFit) => {

        const images = [];
    
        // Loop through top-level keys
        if (cart[selectedOutFit]) {

            for (const [key, value] of Object.entries(cart[selectedOutFit])) {
                if (key === "total") continue;
        
                // If demo_image exists directly
                if (value?.item?.demo_image) {
                    images.push({ key, image: value.item.demo_image, styleData: value });
                }
        
                // If it's the 'extra' category, loop its sub-categories
                if (key === "extra") {
                    for (const [subKey, subValue] of Object.entries(value)) {
                        if (subValue?.item?.demo_image) {
                            images.push({ key: subKey, image: subValue.item.demo_image, styleData: subValue});
                        }
                    }
                }
            }

        }
    
        return images;
    };

    const buttonStyle = (value) => {

        return {
            zIndex: value.item.z_index || 0
        }
    
    }
    
    const selectedCart = getDemoImages(cart, selectedOutFit).map(({ key, image, styleData }, index) => (
        <img 
            key={`${key}-${index}`} 
            style={buttonStyle(styleData)} 
            src={image} 
            alt={key} 
        />
    ));

    return (
        <div className={styles.board}>
            <div className={styles.demo}>
                {selectedCart}
                <img 
                    key="watermark"
                    style={{zIndex: 7}} 
                    src={watermark} 
                    alt={"watermark"} 
                />
            </div>
        </div>
    )
}