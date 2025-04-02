import styles from "./Cart.module.css"
export default function Outfit({cart, pickOutFit}) {

    if (!cart || cart.length === 0) {
        return <div>No outfits in cart.</div>;
    }

    //first we need div to represent each outfit in cart 
    //if cart.length > 0

    return (
        <>
            {cart.map((outfit, index) => {
                const theOutFit = Object.entries(outfit)
                    .filter(([key,value]) => key !== "total" && value?.item)
                    .map(([key, value], IMGindex) => (
                        <img 
                            key={`${key}-${IMGindex}`} 
                            style={{zIndex: value.item.zIndex || 0}}
                            src={value.item.image} 
                            alt={key} 
                        />
                    ))
                return (
                    <div key={index} className={styles.outfit} onClick={() => pickOutFit(index)}>
                        {theOutFit}
                    </div>
                )
            })}
        </>

    );
}