import Image from "./image";

export default function Outfit({cart, pickOutFit, removeOutFit, editOutFit}) {

    if (!cart || cart.length === 0) {
        return <div>No outfits in cart.</div>;
    }

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