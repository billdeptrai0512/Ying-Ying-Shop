import { Link } from "react-router-dom"
import styles from "./header.module.css"
import Path from "./path";

export default function Header() {

    return (
        <header className={styles.header}>
            
            { renderBanner() }

            <Path />

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

