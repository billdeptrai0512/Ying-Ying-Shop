import './MainPage.css'
import { useState } from "react"
import Header from '../Header/Header'
import Body from './Body/body'


export default function MainPage({cart}) {

  const [resetTrigger, setResetTrigger] = useState(false)

  return (
    <>
      <Header cart={cart} resetTrigger={resetTrigger}/>
      <Body setResetTrigger={setResetTrigger}/>
    </>
  )
}

