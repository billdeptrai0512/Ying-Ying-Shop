
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../public/authContext';
import styles from "./admin.module.css"
import { LogOut } from 'lucide-react';


export default function Logout() {

    const { logout } = useAuth()

    const navigate = useNavigate()

    const handleLogout = () => {

        try {

            logout()

            navigate('/')
            
        } catch (err) {

            console.error('Logout failed', err);

        }
    };


    return (
        <form onSubmit={handleLogout} className={styles.form}>
            <button type="submit" style={{cursor: "pointer"}}> <LogOut size={18}/> </button>
        </form>
    );
}