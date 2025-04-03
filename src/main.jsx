/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import Body from './mainpage/Body/Body.jsx';
import MainPage from "./mainpage/MainPage.jsx"
import ErrorPage from './Error-Page.jsx';
import Cart from './cart/Cart.jsx';
//one way is to wrap up a function + state and return the router
import { HashRouter, Routes, Route } from "react-router-dom";
import { createContext, useState } from 'react';

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  const saveOutFitInCart = (outfit) => {

    setCart(prevCart => [...prevCart, outfit]);
 
  };

  return (
    <CartContext.Provider value={{ cart, saveOutFitInCart }}>
      {children}
    </CartContext.Provider>
  );
}

// function App() {

//     const router = createBrowserRouter([
//       {
//         path: "/",
//         element: <MainPage />,
//         errorElement: <ErrorPage />,
//         children: [
//           {
//             path: "", //default body
//             element: <Body />,
//           },
//           {
//             path: "cart",
//             element: <Cart />
//           }
//         ]
//       },
//     ])

//     return (
//       <CartProvider>
//         <RouterProvider router={router} />
//       </CartProvider>
//     );
// }


function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route index element={<Body />} />
            <Route path="cart" element={<Cart />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </HashRouter>
    </CartProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)




