import { useAuth } from "../public/authContext";
import { Link } from "react-router-dom";
import styles from "./Item.module.css"

export default function Information({folderId, name, selectedItem, isChoosen, itemSection}) {
    
    const { user } = useAuth()

    return (
        <div className={styles.information}>
            <h3> {name} </h3>

            {selectedItem && isChoosen === itemSection ? 
                <p> Số lượng: {selectedItem.amount} </p> 
                : 
                null 
            }

            {user ? <Link to={`/file/upload/${folderId}`}>Add File</Link> : null}

        </div>
    )
}