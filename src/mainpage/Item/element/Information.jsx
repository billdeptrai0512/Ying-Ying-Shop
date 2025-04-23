import styles from "../Item.module.css"

export default function Information({name, selectedItem, isChoosen, itemSection}) {
    
    return (
        <div className={styles.information}>
            <h3> {name} </h3>
            {selectedItem && isChoosen === itemSection ? 
                <p> Số lượng: {selectedItem.amount} </p> 
                : 
                null 
            }
        </div>
    )
}