
import styles from "./folder.module.css"

export default function Information({name, amount}) {

    return (
        <div className={styles.information}>
            <h3> {name} </h3>
            {amount ? <p> Số lượng: {amount} </p> :  null }
        </div>
    )
}