import './MainPage.css'
import Header from '../Header/Header'
import { Outlet } from "react-router-dom"

export default function MainPage() {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

