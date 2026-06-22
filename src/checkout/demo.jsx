import { getDemoImages } from "../public/outfitLayers"
import styles from "./checkout.module.css"
import watermark from "./../assets/wtm.png"

export default function Demo({ cart, selectedOutFit }) {

    const layers = getDemoImages(cart[selectedOutFit])
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(({ key, image, zIndex }, index) => (
            <img
                key={`${key}-${index}`}
                style={{ zIndex }}
                src={image}
                alt={key}
            />
        ));

    return (
        <div className={styles.board}>
            <div className={styles.demo}>
                {layers}
                <img
                    key="watermark"
                    style={{ zIndex: 7 }}
                    src={watermark}
                    alt={"watermark"}
                />
            </div>
        </div>
    )
}
