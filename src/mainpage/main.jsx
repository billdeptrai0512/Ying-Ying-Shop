import { Outlet } from "react-router-dom"
import Header from '../header/main.jsx'
import Body from "../outfit/main.jsx"
import styles from "./mainPage.module.css"

export default function MainPage() {

  return (
    <>
      <Header/>
      <div className={styles.body}> 
        <Outlet />
      </div>
    </>
  )
}


        