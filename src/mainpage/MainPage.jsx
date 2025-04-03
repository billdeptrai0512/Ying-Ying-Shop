import './MainPage.css'
import { Outlet } from "react-router-dom"
import Header from "../header/Header.jsx"

export default function MainPage() {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

