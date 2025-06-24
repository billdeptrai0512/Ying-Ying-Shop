import styles from "./cart.module.css"
import watermark from "./../assets/wtm.png"

export default function Demo({cart, selectedOutFit}) {

    const getDemoImages = (cart, selectedOutFit) => {

        const images = [];

        const outFit = cart[selectedOutFit];
        if (!outFit) return ;
    
        // Loop through top-level keys
        for (const [key, value] of Object.entries(outFit)) {
            if (key === "total") continue;

            
            // If demo_image exists directly
            if (value?.item?.demo_image) {
                // Skip if demo_image is null
                if (value.item.demo_image === "null") continue;

                const demo_image = value.item.demo_image;
                const z_index = value.item.z_index || 0; // Ensure z_index has a default value
                console.log(z_index)
                if (!Array.isArray(demo_image)) {
                    images.push({ key, image: demo_image, styleData: { z_index } });
                }

                // If demo_image is an array, loop through it
                else {
                    demo_image.forEach((img, index) => {
                        if (index === 1) {
                            // modify for cổ áo thủy thủ 
                            // cân nhắc cho phép admin set z_index for each demo image // hoặc mặc định
                            images.push({ key: `${key}-${index}`, image: img, styleData: { z_index: 6 } });
                        } else {
                            images.push({ key: `${key}-${index}`, image: img, styleData: { z_index } });
                        }

                    });
                }
            }

            // If it's the 'extra' category, loop its sub-categories
            if (key === "extra") {
                for (const [subKey, subValue] of Object.entries(value)) {
                    if (subValue?.item?.demo_image) {
                        images.push({ key: subKey, image: subValue.item.demo_image, styleData: { z_index: subValue.item.z_index || 0 } });
                    }
                }
            }
        }
    
        return images;
    };
    
    const selectedCart = cart[selectedOutFit] 
        ? getDemoImages(cart, selectedOutFit).map(({ key, image, styleData }, index) => (
            <img 
                key={`${key}-${index}`} 
                style={{ zIndex: styleData.z_index }} 
                src={image} 
                alt={key} 
            />
        ))
        : null;

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