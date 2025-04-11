import './MainPage.css'
import { Outlet } from "react-router-dom"
import { useCart } from '../main.jsx'
import Header from '../header/Header.jsx'
import MobileHeader from '../header/MobileHeader.jsx'


export default function MainPage() {

  const { isMobile } = useCart()

  return (
    <>
      {isMobile ? <MobileHeader /> : <Header />} 
      <Outlet />
    </>
  )
}


