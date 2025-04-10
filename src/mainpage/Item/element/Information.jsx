import DesktopStyles from "../Item.module.css"
import MobileStyles from "../MobileItem.module.css"
import { useCart } from "../../../main"

export default function Information({name, selectedItem, isChoosen, itemSection}) {

    const { isMobile } = useCart()
    const styles = isMobile ? MobileStyles : DesktopStyles
    
    return (
        <div className={styles.information}>
            <h2> {name} </h2>
            {selectedItem && isChoosen === itemSection ?  
                <p className={styles.amount}>Số lượng: {selectedItem.amount}</p> : null
            }
        </div>
    )
}