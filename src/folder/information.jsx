import { useAuth } from "../public/authContext";
import { Link } from "react-router-dom";
import styles from "./folder.module.css"
import { CirclePlus } from 'lucide-react';

export default function Information({folderId, name, amount}) {
    
    const { user } = useAuth()

    return (
        <div className={styles.information}>
            <h3> {name} </h3>

            {amount ? <p> Số lượng: {amount} </p> :  null }

            {user ? <Link to={`/file/upload/${folderId}`}>
                <CirclePlus size={18}/>
            </Link> : null}

        </div>
    )
}