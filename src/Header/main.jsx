import styles from "./header.module.css"
import { Link } from "react-router-dom"
import Logout from "../form/logout"
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
                    <div style={{display:"flex", gap:"1em"}}>
                        <Link to={`/order`} >ORDER </Link>

                        <Logout/>
                    </div>
                    
                    
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