import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { useSpring, animated } from "@react-spring/web";
import styles from "../Body.module.css"
import { ShoppingCart } from 'lucide-react'; 

export default function CheckOut({outFit, setMissingSize, saveOutFitInCart, resetDefault}) {

    const [prevTotal, setPrevTotal] = useState(outFit.total);

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


    const addToCart = () => {

        const missingSizes = Object.entries(outFit)
            .filter(([category, item]) => category !== "total" && category !== "bow" && category !== "bag" && item.item && !item.size)
            .map(([category]) => category)

        //if outFit. all key = null then prevent them to send empty cart
        if (missingSizes.length === 0) {

            console.log(outFit)

            saveOutFitInCart(outFit)
            resetDefault()
            return

        } else {
            return setMissingSize(missingSizes)
        }
        

        // we must prevent the user to checkout if the user not select size for all item they have picked
        //how do we track the size element of the each category in outfit ?????
    }

    return (
        <div className={styles.checkout}> 
            <h4 data-testid="total-text">Tổng tiền: 
                <animated.span>
                    {springProps.value.to((val) => ` ${formatCurrency(val)}`)}
                </animated.span>
            </h4>    
            <button onClick={addToCart}>
                Thêm vào giỏ hàng
            </button>
        </div>
    )
}