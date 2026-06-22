import styles from "./outfit.module.css";
import OutfitLayers from "../../public/outfitLayers";

export default function Demo({ outFit }) {
    return (
        <div className={styles.board}>
            <div className={styles.demo}>
                <OutfitLayers outFit={outFit} />
            </div>
        </div>
    );
}
