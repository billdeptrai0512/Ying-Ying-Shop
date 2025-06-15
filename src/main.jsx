import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import './index.css'
import MainPage from "./mainpage/main.jsx"
import ErrorPage from './public/error-page.jsx';
import Cart from './cart/main.jsx';
import Admin from './admin/main.jsx';
import Login from './admin/login.jsx';
import Folder from './folder/main.jsx';
import FileUpload from './admin/upload-file.jsx';
import EditFile from './admin/edit-file.jsx';
import CreateFolder from './admin/createfolder.jsx';
import Order from './admin/order.jsx';
import Outfit from './outfit/main.jsx';
import ConfirmOrder from './cart/confirmOrder.jsx';
import PlaceOrder from './cart/placeOrder.jsx';
import CheckOut from './checkout/main.jsx';
import { FolderProvider } from './public/folderContext.jsx';
import { CartProvider } from './public/cartContext.jsx';
import { AuthProvider } from './public/authContext.jsx'
import { WebSocketProvider } from './public/webSocket.jsx';
import { OutfitProvider } from './public/outfitContext.jsx';

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
          ]
        },
        {
          path: "checkout/:orderId",
          element: <CheckOut />,
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
              path: "folder",
              element: <CreateFolder />,
            },
            {
              path: "order",
              element: <Order />,
            },
            {
              path: "file/upload/:folderId?",
              element: <FileUpload/>,
            },
            {
              path: "file/:fileId",
              element: <EditFile/>,
            },
          ]
        }
      ],
    },
  ]);

  return (

    <AuthProvider>
      <WebSocketProvider>
        <FolderProvider>
          <CartProvider>
            <OutfitProvider>
              <RouterProvider router={router} />
              <Analytics />
            </OutfitProvider>
          </CartProvider>
        </FolderProvider>
      </WebSocketProvider>
    </AuthProvider>

  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)




