import styles from "./header.module.css"
import { Link } from "react-router-dom"
import Logout from "../admin/logout"
import { useAuth } from "../public/authContext"
export default function Header() {

    const { user } = useAuth()

    return (
        <header className={styles.header}>
            <div className={styles.banner}>
                <h1> 
                    <Link to={`/`} >YING YING COSPLAY SHOP ❤️ </Link>
                </h1> 
                <h2>Tự phối seifuku theo style của bạn!</h2>
            </div>
            <div className={styles.path}>


                {user ? (
                    <>
                        <Link to={`/admin/inventory`} >INVENTORY </Link>
                        <Link to={`/admin/order`} >ORDER </Link>
                        <Logout />
                    </>
                    
                ) : (
                    <>
                        <a href="https://www.facebook.com/yingyingcosshop" target="_blank" rel="noopener noreferrer" >
                            FANPAGE 
                        </a>
                        <a href="https://www.tiktok.com/@ying_ying_cosplayshop" target="_blank" rel="noopener noreferrer" >
                            TIKTOK 
                        </a>
                    </>
                )}
                
            </div>

        </header>
    )
}

// : (
//     <Link to="/login" >LOGIN </Link>
// )}  