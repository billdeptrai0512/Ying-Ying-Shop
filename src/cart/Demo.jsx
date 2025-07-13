import { useMemo } from "react";
import { useCart } from "../public/cartContext";
import Imgix from "react-imgix";
import styles from "./cart.module.css"
import watermark from "./../assets/wtm.png"

export default function Demo({selectedOutFit}) {

    const { cart } = useCart()

    //     const images = [];

    //     const outFit = cart[selectedOutFit];
    //     if (!outFit) return ;
    
    //     // Loop through top-level keys
    //     for (const [key, value] of Object.entries(outFit)) {
    //         if (key === "total") continue;

            
    //         // If demo_image exists directly
    //         if (value?.item?.demo_image) {
    //             // Skip if demo_image is null
    //             if (value.item.demo_image === "null") continue;

    //             const demo_image = value.item.demo_image;
    //             const z_index = value.item.z_index || 0; // Ensure z_index has a default value
    //             console.log(z_index)
    //             if (!Array.isArray(demo_image)) {
    //                 images.push({ key, image: demo_image, styleData: { z_index } });
    //             }

    //             // If demo_image is an array, loop through it
    //             else {
    //                 demo_image.forEach((img, index) => {
    //                     if (index === 1) {
    //                         // modify for cổ áo thủy thủ 
    //                         // cân nhắc cho phép admin set z_index for each demo image // hoặc mặc định
    //                         images.push({ key: `${key}-${index}`, image: img, styleData: { z_index: 6 } });
    //                     } else {
    //                         images.push({ key: `${key}-${index}`, image: img, styleData: { z_index } });
    //                     }

    //                 });
    //             }
    //         }

    //         // If it's the 'extra' category, loop its sub-categories
    //         if (key === "extra") {
    //             for (const [subKey, subValue] of Object.entries(value)) {
    //                 if (subValue?.item?.demo_image) {
    //                     images.push({ key: subKey, image: subValue.item.demo_image, styleData: { z_index: subValue.item.z_index || 0 } });
    //                 }
    //             }
    //         }
    //     }
    
    //     return images;
    // };
    
    const selectedOutfitImages = useMemo(() => {

        const outfit = cart[selectedOutFit]

        if (!outfit) return null;

        return getDemoImages(outfit)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(({ key, image, zIndex }, index) => (
                <div
                    key={`${key}-${index}`}
                    style={{
                        position: "absolute",
                        zIndex,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    >
                    <Imgix
                        src={image}
                        sizes="340px"
                        alt={key}
                        imgixParams={{ auto: "format,compress" }}
                        htmlAttributes={{ alt: "layer image" }}
                    />
                </div>
        ));
    }, [cart, selectedOutFit]);

    return (
        <div className={styles.board}>
            <div className={styles.demo}>
                {selectedOutfitImages}
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

function getDemoImages(outFit) {
    const images = [];
    if (!outFit) return images;
  
    for (const [key, value] of Object.entries(outFit)) {
      if (key === "total") continue;
  
      if (value?.item?.demo_image) {
        const demoImage = value.item.demo_image;
        const baseZIndex = value.item.z_index || 0;
  
        if (Array.isArray(demoImage)) {
          demoImage.forEach((img, idx) => {
            const zIndex = idx === 1 ? 6 : baseZIndex;
            images.push({ key: `${key}-${idx}`, image: img, zIndex });
          });
        } else {
          images.push({ key, image: demoImage, zIndex: baseZIndex });
        }
      }
  
      if (key === "extra") {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue?.item?.demo_image) {
            images.push({
              key: subKey,
              image: subValue.item.demo_image[0],
              zIndex: subValue.item.z_index || 0,
            });
          }
        });
      }
    }
  
    return images;
  }