import { useCart } from "../public/cartContext";
import OutfitLayers from "../public/outfitLayers";
import styles from "./Cart.module.css"
import watermark from "./../assets/wtm.png"

export default function Demo({ selectedOutFit }) {

    const { cart } = useCart()

    return (
        <div className={styles.board}>
            <div className={styles.demo}>

                <OutfitLayers outFit={cart[selectedOutFit]} />

                <img key="watermark" style={{ zIndex: 7 }}
                    src={watermark} alt={"watermark"}
                />
            </div>
        </div>
    )
}
