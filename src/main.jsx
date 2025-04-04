/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import Body from './body/body.jsx';
import MainPage from "./mainpage/MainPage.jsx"
import ErrorPage from './Error-Page.jsx';
import Cart from './cart/Cart.jsx';

import { createContext, useState } from 'react';

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  const saveOutFit = (outfit) => {

    setCart(prevCart => [...prevCart, outfit]);
 
  };

  const editOutFit = (outfit, key) => {

    setCart(prevCart => {

      return prevCart.map(OutFit => {

        if (OutFit.id === outfit.id) {

          const newItem = OutFit[key].size ? {item: null, size: null} : {item: null}
          const newTotal = OutFit.total - outfit[key].item.total

          if (newTotal === 0) return null

          return {
            ...OutFit,
            [key] : newItem,
            total: newTotal,
          }

        }

        return OutFit;

      })
      .filter(outfit => outfit !== null);
    })
  }

  const removeOutFit = (outfitToRemove) => {
    setCart(prevCart => prevCart.filter(outfit => outfit.id !== outfitToRemove.id));
  };

  return (
    <CartContext.Provider value={{ cart, saveOutFit, removeOutFit, editOutFit}}>
      {children}
    </CartContext.Provider>
  );
}

function App() {

    const router = createBrowserRouter([
      {
        path: "/",
        element: <MainPage />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "", //default body
            element: <Body />,
          },
          {
            path: "cart",
            element: <Cart />
          }
        ]
      },
    ])

    return (
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)




