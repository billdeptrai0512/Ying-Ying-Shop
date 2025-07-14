import { Outlet, Navigate } from "react-router-dom"

//use Auth here
import { useAuth } from "../public/authContext"

export default function Admin() {

  const { user } = useAuth()

  //login and register don't need authen ?
  //how do outlet know different ?
  //
  if (!user) {
    return <Navigate to="/login" replace />; 
  }

  return (
    <Outlet />
  )
}


        