
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import './index.css'
import MainPage from "./mainpage/main.jsx"
import ErrorPage from './public/error-page.jsx';
import Cart from './cart/main.jsx';
import Login from './form/login.jsx';
import Folder from './folder/main.jsx';
import FileUpload from './form/upload-file.jsx';
import Edit from './form/edit.jsx';
import FolderCreate from './form/folder.jsx';
import { FolderProvider } from './public/folderContext.jsx';
import { CartProvider } from './public/cartContext.jsx';
import { AuthProvider } from './public/authContext.jsx'
import Outfit from './outfit/main.jsx';

export default function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Outfit />,
        },
        {
          path: "cart",
          element: <Cart />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "folder",
          element: <FolderCreate />,
        },
        {
          path: "file/upload/:folderId?",
          element: <FileUpload/>,
        },
        {
          path: "file/:fileId",
          element: <Edit/>,
        },
      ],
    },
  ]);

  return (
    <FolderProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Analytics />
        </CartProvider>
      </AuthProvider>
    </FolderProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)




