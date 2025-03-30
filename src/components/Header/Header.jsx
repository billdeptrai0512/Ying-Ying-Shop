import styles from "./Header.module.css"

export default function Header({cart}) {
    return (
        <header className={styles.header}>

            <div className={styles.banner}>
                 <p>❤ Ying Ying - Tiệm thuê đồ cosplay, seifuku ❤</p> 
            </div>
            <div className={styles.main}>
                <div className={styles.logo}>
                    <h1>YING YING COSPLAY SHOP</h1>
                    <p>Tự phối seifuku theo style của bạn! ❤</p>
                </div>
                <div className={styles.contact}>
                    <div>
                        CART  <span style={{ color: '#DC1E1E' }}>( {cart.number} )</span>
                    </div>
                    <div className={styles.middle}>FANPAGE</div>
                    <div>TIKTOK</div>
                </div>
            </div>

        </header>
    )
}