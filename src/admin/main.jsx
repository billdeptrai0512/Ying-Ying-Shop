import { Outlet } from "react-router-dom"

//use Auth here
import { useAuth } from "../public/authContext"

export default function Admin() {

  const { user } = useAuth

  //login and register don't need authen ?
  //how do outlet know different ?
  //

  return (
    <Outlet />
  )
}


        