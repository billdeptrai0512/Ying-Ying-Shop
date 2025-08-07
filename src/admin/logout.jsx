
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../public/authContext';
import { LogOut } from 'lucide-react';
import styles from "./admin.module.css"

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
            <button type="submit" style={{cursor: "pointer"}}> Log Out </button>
        </form>
    );
}