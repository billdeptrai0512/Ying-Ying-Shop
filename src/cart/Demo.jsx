import styles from "./Cart.module.css"

export default function Demo({cart, selectedOutFit}) {

    const selectedCart = cart[selectedOutFit] ? Object.entries(cart[selectedOutFit])
        .filter(([key, value]) => key !== "total" && value?.item?.demoImage)
        .map(([key, value], index) => (
            <img 
                key={`${key}-${index}`} 
                style={{zIndex: value.item.zIndex || 0}}
                src={value.item.demoImage} 
                alt={key} 
            />
        )) : null

    return (
        <div className={styles.board}>
            <div className={styles.demo}>
                {selectedCart}
            </div>
        </div>
    )
}