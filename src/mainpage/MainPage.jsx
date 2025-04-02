import './MainPage.css'
import Header from '../header/Header'
import { Outlet } from "react-router-dom"

export default function MainPage() {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

