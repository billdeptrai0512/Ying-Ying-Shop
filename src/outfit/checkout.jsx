import { useState, useEffect } from "react";
import styles from "./outfit.module.css";
// eslint-disable-next-line no-unused-vars
import { useSpring, animated } from "@react-spring/web";
import { useCart } from "../public/cartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from 'lucide-react';

export default function CheckOut({outFit, setMissingSize, resetDefault}) {

    const navigate = useNavigate();


    const { cart, saveOutFit } = useCart()
    const [prevTotal, setPrevTotal] = useState(outFit?.total);
    const [numberOfCart, setNumberOfCart] = useState(0)
    
    useEffect(() => {

        setNumberOfCart(cart.length)

    }, [cart])

    useEffect(() => {

        setPrevTotal(outFit?.total);

    }, [outFit?.total]);

    const springProps = useSpring({
        from: { value: prevTotal },
        to: { value: outFit?.total },
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

            let count = parseInt(sessionStorage.getItem('addToCart') || '0', 10);

            count++;
            sessionStorage.setItem('addToCart', count);

            window.gtag('event', 'click', {
                event_category: 'Button',
                event_label: 'add to cart',
                click_count: count,
            });

            resetDefault()

        } else {

            setMissingSize(missingSizes)

        }
    }

    return (
        <div className={styles.submit}> 
            <div className={styles.total}>
                <span data-testid="total-text">Tổng tiền: </span>    
                <animated.span>
                    {springProps.value.to((val) => ` ${formatCurrency(val)}`)}
                </animated.span>
            </div>

            <button className={styles.cta} onClick={addToCart} style={{width: numberOfCart > 0 ? "70%" : "100%"}}>   
                <h3 style={{fontSize: "1.25em", fontWeight: 500}}>Thêm vào giỏ hàng</h3>
            </button>


            {numberOfCart > 0 && <button className={styles.back}
                onClick={() => navigate("/cart")}
            >
                <ShoppingCart size={22} color="#000000" style={{fontWeight: "800", marginRight: "0.5em",}} />
                <span style={{ fontWeight: "650", color: '#DC1E1E', fontSize: "1.5em" }}> ( {numberOfCart} )</span>
            </button>}
    </div>
    )
}