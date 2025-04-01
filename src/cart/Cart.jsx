import { useCart } from "../main";
import styles from "./Cart.module.css"
import Demo from "./Demo";

export default function Cart() {

    const { cart } = useCart()

    console.log(cart[0])

    const selectedCart = Object.entries(cart[0])
    .filter(([key, value]) => key !== "total" && value?.item)
    .map(([key, value], index) => (
        <img 
            key={`${key}-${index}`} 
            style={{zIndex: value.item.zIndex || 0}}
            src={value.item.demoImage} 
            alt={key} 
        />
    ));

    return (
        <div className={styles.body}>
            <Demo 
                cart={cart} 
            />
            {selectedCart}
        </div>
    );
}