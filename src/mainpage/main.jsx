import { Outlet } from "react-router-dom"
import Header from '../Header/main.jsx'

export default function MainPage() {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}


