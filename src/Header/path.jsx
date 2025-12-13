import { useState } from "react"
import { Link } from "react-router-dom"
import { AlignJustify } from 'lucide-react';
import { useAuth } from "../public/authContext"

import styles from "./header.module.css"

export default function Path() {

    const { user, logout } = useAuth()
    const [extend, setExtend] = useState(false)

    const handleLogout = () => {

        try {

            logout()

        } catch (err) {

            console.error('Logout failed', err);

        }
    };

    if (user) return (

        <div className={styles.admin_path}>

            <AlignJustify onClick={() => setExtend((prev => !prev))} />

            {extend === true && (
                <div className={styles.admin_dropdown} >
                    <Link to={`/admin/inventory`} onClick={() => setExtend(false)}>INVENTORY </Link>
                    <Link to={`/admin/order`} onClick={() => setExtend(false)}>ORDER </Link>
                    <Link to={`/admin/favorite`} onClick={() => setExtend(false)}>FAVORITE </Link>
                    <Link to={`/`} onClick={handleLogout}>LOG OUT </Link>
                </div>
            )}


        </div>
    )

    return (
        <div className={styles.path}>
            <a href="https://www.facebook.com/yingyingcosshop" target="_blank" rel="noopener noreferrer" >
                FANPAGE
            </a>
            <a href="https://www.tiktok.com/@ying_ying_cosplayshop" target="_blank" rel="noopener noreferrer" >
                TIKTOK
            </a>
        </div>
    )
}