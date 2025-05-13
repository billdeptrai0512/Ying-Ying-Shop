import styles from "./Header.module.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Logout from "../form/logout"
import { useCart } from "../public/cartContext"
import { useAuth } from "../public/authContext"
export default function Header() {

    const { cart } = useCart()
    const { user } = useAuth()
    
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
                {user ? (
                    <>
                        <span style={{marginLeft: "1rem" , color: '#868686'}}>
                            {user.username.toUpperCase()}
                        </span>
                        <Logout/>
                    </>
                    
                ) : (
                    <Link to="/login" >LOGIN </Link>
                )}  
            </div>

        </header>
    )
}