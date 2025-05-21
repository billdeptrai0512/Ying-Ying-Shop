import styles from "./outfit.module.css"

import watermark from "./../assets/wtm.png"
const facebookLink = "https://www.facebook.com/media/set/?set=a.122106501296570424&type=3"


const buttonStyle = (value) => {

    return {
        zIndex: value.item.z_index || 0
    }
}

export default function Demo({outFit}) {

    const getDemoImages = (outFit) => {
        const images = [];
    
        // Loop through top-level keys
        for (const [key, value] of Object.entries(outFit)) {
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
    
        return images;
    };
    
    const selectedOutFit = getDemoImages(outFit).map(({ key, image, styleData }, index) => (
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
                {selectedOutFit.length > 0 ? selectedOutFit : null}
                <img 
                    key="watermark"
                    style={{zIndex: 7}} 
                    src={watermark} 
                    alt={"watermark"} 
                />
            </div>
            <div className={styles.example}> 
                Bấm vào <a href={facebookLink} target="_blank" rel="noopener noreferrer"> đây</a> tham khảo nếu bạn bí ý tưởng nha 😉
            </div>
        </div>
    )
}