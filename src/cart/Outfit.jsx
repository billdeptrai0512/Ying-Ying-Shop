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
                            <img 
                                key={`${key}-${IMGindex}`} 
                                style={{zIndex: value.item.zIndex || 0}}
                                src={value.item.image} 
                                alt={key} 
                            />
                            <button onClick={() => editOutFit(outfit, key)}> x </button>
                        </div>
                            

                    ))

                return (
                    <>
                        <div key={index + 1}> SET {index + 1} <button  onClick={() => removeOutFit(outfit)}> delete </button> </div>
                        <div key={index} className={styles.outfit}  onClick={() => pickOutFit(index)}>
                                {everyOutFit}
                        </div>
                    </>
                )
            })}
        </>
    );
}