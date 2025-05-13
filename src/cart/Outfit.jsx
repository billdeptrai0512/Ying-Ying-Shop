import Image from "./image";

export default function Outfit({cart, pickOutFit, removeOutFit, editOutFit}) {

    if (!cart || cart.length === 0) {
        return <div>No outfits in cart.</div>;
    }

    console.log(cart)
    //TODO can't extract extra key_value

    return (
        <>
            {cart
                .filter(outfit => outfit && typeof outfit === 'object')
                .map((outfit, index) => (
                    <Image
                        key={outfit.id || index}
                        outfit={outfit}
                        index={index}
                        pickOutFit={pickOutFit}
                        removeOutFit={removeOutFit}
                        editOutFit={editOutFit}
                    />
                ))}
        </>
    );
}