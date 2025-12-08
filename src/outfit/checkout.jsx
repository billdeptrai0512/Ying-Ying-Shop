
import styles from "./outfit.module.css";

// eslint-disable-next-line no-unused-vars
import { useSpring, animated } from "@react-spring/web";
import { useCart } from "../public/cartContext";
import { useNavigate } from "react-router-dom";
import { useOutfit } from "../public/outfitContext";
import { ShoppingCart } from 'lucide-react';

export default function CheckOut() {

    const navigate = useNavigate();

    const { outFit, resetOutfit } = useOutfit();
    const { cart, saveOutFit } = useCart()

    const addToCart = (outFit) => {

        if (isOutfitEmpty(outFit)) return

        const result = saveOutFit(outFit)

        if (result === true) return resetOutfit()

    }

    const springProps = useSpring({
        to: { value: outFit?.total ?? 0 },
        config: { duration: 360 },
    });

    return (

        <div className={styles.submit}>

            {renderTotalPayment(springProps)}

            {renderButtonAddToCart(addToCart, cart.length, outFit)}

            {renderGoToCartButton(navigate, cart.length)}

        </div>
    )
}

const renderGoToCartButton = (navigate, numberOfCart) => {

    if (numberOfCart === 0) return null

    const shoppingCartStyle = { fontWeight: "800", marginRight: "0.5em", }
    const spanStyle = { fontWeight: "650", color: '#DC1E1E', fontSize: "1.5em" }

    return (
        <button className={styles.back} onClick={() => navigate("/cart")}>
            <div style={{ position: "relative", display: "inline-block" }}>
                <ShoppingCart
                    size={27}
                    color="#000000"
                    style={{ fontWeight: 800 }}
                />

                {/* Badge số lượng */}
                <span
                    style={{
                        position: "absolute",
                        top: "-8px",
                        right: "9px",
                        zIndex: 2,
                        fontWeight: 700,
                        color: "#DC1E1E",
                        fontSize: "1.2em",
                    }}
                >
                    {numberOfCart}
                </span>
            </div>
        </button>
    )
}

const renderTotalPayment = (springProps) => {
    return (
        <div className={styles.total}>
            <span data-testid="total-text">Tổng tiền: </span>
            <animated.span>
                {springProps.value.to((val) => ` ${formatCurrency(val)}`)}
            </animated.span>
        </div>
    )
}

const renderButtonAddToCart = (addToCart, numberOfCart, outFit) => {

    const buttonStyle = { width: numberOfCart > 0 ? "70%" : "100%" }

    return (
        <button className={styles.cta} onClick={() => addToCart(outFit)} style={buttonStyle}>
            <h3 style={{ fontSize: "1.25em", fontWeight: 500 }}>Thêm vào giỏ hàng</h3>
        </button>
    )
}

const formatCurrency = (value) => {
    const intValue = Math.floor(value);
    return intValue.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + "đ";
};

const isOutfitEmpty = (outFit) => {
    // Check if all keys (except "total") have null or empty values
    const hasNoItems = Object.entries(outFit)
        .filter(([category]) => category !== "total") // Exclude "total"
        .every(([, item]) => !item || !item.item);

    // Explicitly check if bow.item or bag.item has any value
    const hasNoExtras = (!outFit.extra.bow || !outFit.extra.bow.item) && (!outFit.extra.bag || !outFit.extra.bag.item);

    return hasNoItems && hasNoExtras;
};