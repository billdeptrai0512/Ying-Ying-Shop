import styles from "./Header.module.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../main"

export default function Header() {

    const { cart } = useCart()

    const [numberOfCart, setNumberOfCart] = useState(0)

    useEffect(() => {

        setNumberOfCart(cart.length)

    }, [cart])

    return (
        <header className={styles.header}>
            <div className={styles.banner}>
                <h1> 
                    <Link to={`/`} >YING YING COSPLAY SHOP ❤️  </Link>
                </h1> 
                <h2>Tự phối seifuku theo style của bạn!</h2>
            </div>
            <div className={styles.path}>
                <Link  to={`/cart`}>CART {
                        cart.length === 0 ? null :
                        <span style={{ color: '#DC1E1E' }}> ( {numberOfCart} )</span>
                    } 
                </Link>
                {/* <Link  to={`/cart`}>TIKTOK {
                        cart.length === 0 ? null :
                        <span style={{ color: '#DC1E1E' }}> ( {numberOfCart} )</span>
                    } 
                </Link> */}
            </div>

        </header>
    )
}