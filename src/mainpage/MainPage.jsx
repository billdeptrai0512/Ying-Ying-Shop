import { Outlet } from "react-router-dom"
import styles from './Mainpage.module.css'
import Header from "../Header/Header"

export default function MainPage() {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}


