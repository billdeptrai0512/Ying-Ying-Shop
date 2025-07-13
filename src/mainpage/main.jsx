import { Outlet } from "react-router-dom"
import Header from '../header/main.jsx'

export default function MainPage() {

  return (
    <>
      <Header/>
      {/* <div className={styles.body}> 
        <Outlet />
      </div> */}
      <Outlet />
    </>
  )
}


        