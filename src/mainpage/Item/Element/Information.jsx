import styles from "../Item.module.css"

export default function Information({name, selectedItem, isChoosen, itemSection}) {

    return (
        <div className={styles.information}>
            <h2> {name} </h2>
            {selectedItem && isChoosen === itemSection ?  
                <p className={styles.amount}>Số lượng: {selectedItem.amount}</p> : null
            }
        </div>
    )
}