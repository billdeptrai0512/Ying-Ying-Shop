import { Outlet } from "react-router-dom"
import Header from '../header/Header.jsx'
import styles from './MainPage.module.css'

export default function MainPage() {

  return (
    <div className={styles.wrapper}>
      <Header />
      <Outlet />
    </div>
  )
}


