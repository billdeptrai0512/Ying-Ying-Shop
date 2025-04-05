import styles from "./Cart.module.css"
export default function Outfit({cart, pickOutFit, removeOutFit, editOutFit}) {

    if (!cart || cart.length === 0) {
        return <div>No outfits in cart.</div>;
    }

    //feature may need:
    // add new item from set
    // scroll Y

    return (
        <>
            {cart
                .filter(outfit => outfit && typeof outfit === 'object')
                .map((outfit, index) => {
                const everyOutFit =  Object.entries(outfit)
                    .filter(([keyCategory ,value]) => keyCategory !== "total" && value?.item)
                    .map(([key, value], IMGindex) => (
                        <div key={`${outfit.id}-${key}`}>
                            <div>
                                <img 
                                    key={`${key}-${IMGindex}`} 
                                    style={{zIndex: value.item.zIndex || 0}}
                                    src={value.item.image} 
                                    alt={key} 
                                />
                                <button onClick={() => editOutFit(outfit, key)}> x </button>
                            </div>
                        </div>
                            

                    ))

                return (
                    <div className={styles.wrapper}>
                        <div className={styles.set} key={index + 1}>
                            <h4>SET {index + 1} </h4>
                            <button  onClick={() => removeOutFit(outfit)}> XÓA </button> 
                        </div>
                        <div key={index} className={styles.outfit}  onClick={() => pickOutFit(index)}>
                                {everyOutFit}
                        </div>
                    </div>
                )
            })}
        </>
    );
}