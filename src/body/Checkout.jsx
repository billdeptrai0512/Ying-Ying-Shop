import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { useSpring, animated } from "@react-spring/web";
import { useCart } from "../public/cartContext";


export default function CheckOut({outFit, setMissingSize, resetDefault, styles}) {

    const { saveOutFit } = useCart()

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

        //TODO prevent save empty outfit
        //if outFit. all key = null then prevent them to send empty cart
        if (missingSizes.length === 0) {

            saveOutFit(outFit)

            resetDefault()

        } else {

            setMissingSize(missingSizes)

        }
    }

    return (
        <> 
            <div className={styles.total}>
                <h3 data-testid="total-text">Tổng tiền: </h3>    
                <animated.span>
                    {springProps.value.to((val) => ` ${formatCurrency(val)}`)}
                </animated.span>
            </div>
            <button onClick={addToCart}>
                Thêm vào giỏ hàng
            </button>
        </>
    )
}