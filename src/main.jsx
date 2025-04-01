import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import MainPage from './mainpage/MainPage.jsx'
import Body from './mainpage/Body/body.jsx';
import ErrorPage from './Error-Page.jsx';
import Cart from './cart/Cart.jsx';
import PickItem from './mainpage/Body/Element/PickItem.jsx';

//one way is to wrap up a function + state and return the router

import { useState } from 'react';

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
  
    }

    const router = createBrowserRouter([
      {
        path: "/",
        element: <MainPage cart={cart}/>,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "", //default body
            element: <PickItem saveOutFitInCart={saveOutFitInCart}/>,
          },
          {
            path: "cart",
            element: <Cart cart={cart}/>
          }
        ]
      },
    ])

    return <RouterProvider router={router} />
}



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)




