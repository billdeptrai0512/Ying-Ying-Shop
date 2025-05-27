import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { useSpring, animated } from "@react-spring/web";
import { useCart } from "../public/cartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from 'lucide-react';



export default function CheckOut({outFit, setMissingSize, resetDefault, styles}) {

    const navigate = useNavigate();

    const { cart, saveOutFit } = useCart()
    const [prevTotal, setPrevTotal] = useState(outFit.total);
    const [numberOfCart, setNumberOfCart] = useState(0)
    
    useEffect(() => {

        setNumberOfCart(cart.length)

    }, [cart])

    useEffect(() => {
        setPrevTotal(outFit.total);
    }, [outFit.total]);

    const springProps = useSpring({
        from: { value: prevTotal },
        to: { value: outFit.total },
        config: { duration: 360 },
    });

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

    const addToCart = () => {

        if (isOutfitEmpty(outFit)) {
            return;
        }

        const missingSizes = Object.entries(outFit)
            .filter(([category, item]) => category !== "total" && category !== "bow" && category !== "bag" && item.item && !item.size)
            .map(([category]) => category)

        if (missingSizes.length === 0) {

            saveOutFit(outFit)

            resetDefault()

        } else {

            setMissingSize(missingSizes)

        }
    }

    return (
        <div className={styles.submit}> 
            <div className={styles.total}>
                <h3 data-testid="total-text">Tổng tiền: </h3>    
                <animated.span>
                    {springProps.value.to((val) => ` ${formatCurrency(val)}`)}
                </animated.span>
            </div>
            <div style={{display: "flex"}}>
                <button style={{display: "flex", alignItems: "center", justifyContent:"center", width: `${numberOfCart > 0 ? "70%" : "100%"}`, cursor: "pointer"}}
                    onClick={addToCart}
                >
                    Thêm vào giỏ hàng
                </button>

                {numberOfCart > 0 && <button className={styles.back} style={{ backgroundColor: "#E3C4C1", display: "flex" , alignItems: "center", justifyContent:"center", width: "30%", cursor: "pointer" }}
                    onClick={() => navigate("/cart")}
                >
                    <ShoppingCart size={"28px"} color="#000000" style={{fontWeight: "800", marginRight: "0.5em",}} />
                    <span style={{ fontWeight: "650", color: '#DC1E1E' }}> ( {numberOfCart} )</span>
                </button>}
                
            </div>
        </div>
    )
}