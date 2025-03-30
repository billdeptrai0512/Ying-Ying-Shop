import './App.css'
import { useState } from "react"
import Header from './components/Header/Header'
import Body from './components/Body/body'

function App() {

  const [cart, setCart] = useState({
    number: 0,
    item: []
  })

  const saveOutFitInCart = (outfit) => {

      setCart(prevCart => ({
        number: prevCart.number + 1,
        item: [...prevCart.item, outfit]
      }));

      console.log(cart)

  }

  const removeOutFitFromCart = (outfit) => {

  }

  return (
    <>
      <Header cart={cart}/>
      <Body saveOutFitInCart={saveOutFitInCart}/>
    </>
  )
}

export default App
