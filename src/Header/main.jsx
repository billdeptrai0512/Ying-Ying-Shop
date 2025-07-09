import { Link } from "react-router-dom"
import { useAuth } from "../public/authContext"
import Logout from "../admin/logout"
import styles from "./header.module.css"

export default function Header() {

    const { user } = useAuth()

    return (
        <header className={styles.header}>
            
            { renderBanner() }
            { renderPath(user) }

        </header>
    )
}

const renderBanner = () => {

    return (
        <div className={styles.banner}>
            <h1> 
                <Link to={`/`} >YING YING COSPLAY SHOP ❤️ </Link>
            </h1> 
            <h2>Tự phối seifuku theo style của bạn!</h2>
        </div>
    )
}

const renderPath = (user) => {

    if (user) return (
        <div className={styles.path}>
            <Link to={`/admin/inventory`} >INVENTORY </Link>
            <Link to={`/admin/order`} >ORDER </Link>
            <Logout />
        </div>
    )

    return (
        <div className={styles.path}>
            <a href="https://www.facebook.com/yingyingcosshop" target="_blank" rel="noopener noreferrer" >
                FANPAGE 
            </a>
            <a href="https://www.tiktok.com/@ying_ying_cosplayshop" target="_blank" rel="noopener noreferrer" >
                TIKTOK 
            </a>
        </div>
    )

}