import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import MainPage from "./mainpage/main.jsx"
import ErrorPage from './public/error-page.jsx';
import Cart from './cart/main.jsx';
import Admin from './admin/main.jsx';
import Login from './admin/login.jsx';
import Order from './admin/order/main.jsx';
import Inventory from './admin/inventory/main.jsx';
import Outfit from './outfit/main.jsx';
import ConfirmOrder from './cart/confirmOrder.jsx';
import PlaceOrder from './cart/placeOrder.jsx';
import CheckOut from './checkout/main.jsx';
import UpdateMeasurements from './admin/inventory/form/update-measurement.jsx';
import EditItem from './admin/inventory/form/edit-item.jsx';
import CreateItem from './admin/inventory/form/create-item.jsx';
import DeleteFile from './admin/inventory/form/delete-item.jsx';
import { InventoryProvider } from './public/inventoryContext.jsx';
import { CartProvider } from './public/cartContext.jsx';
import { AuthProvider } from './public/authContext.jsx'
import { WebSocketProvider } from './public/webSocket.jsx';
import { OutfitProvider } from './public/outfitContext.jsx';

import './index.css'
import Favorite from './admin/favorite/main.jsx';


export default function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Outfit />,
        },
        {
          path: "cart",
          element: <Cart />,
          children: [
            {
              path: "",
              element: <ConfirmOrder />,
            },
            {
              path: "placeorder",
              element: <PlaceOrder />,
            },
            {
              path: "checkout/:orderId",
              element: <CheckOut />,
            },
          ]
        },
        {
          path: "admin",
          element: <Admin />,
          children: [
            {
              path: "",
              element: <Login />,
            },
            {
              path: "favorite",
              element: <Favorite />,
            },
            {
              path: "order",
              element: <Order />,
            },
            {
              path: "inventory",
              element: <Inventory />,
              children: [
                {
                  path: "",
                  element: <UpdateMeasurements />,
                },
                {
                  path: "create/:folderId",
                  element: <CreateItem />,
                },
                {
                  path: "edit/:itemId",
                  element: <EditItem />,
                },
                {
                  path: "delete/:itemId",
                  element: <DeleteFile />,
                },
              ]
            },
          ]
        }
      ],
    },
  ]);

  return (

    <AuthProvider>
      <WebSocketProvider>
        <InventoryProvider>
          <CartProvider>
            <OutfitProvider>
              <RouterProvider router={router} />
              <Analytics />
            </OutfitProvider>
          </CartProvider>
        </InventoryProvider>
      </WebSocketProvider>
    </AuthProvider>

  );
}

sessionStorage.clear();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)




