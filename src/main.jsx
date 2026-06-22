import { StrictMode, Suspense, lazy, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';

// Single Query client for all server-state. staleTime + no focus-refetch keep
// behaviour close to the previous fetch-once-on-mount contexts.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
  },
});

// Customer path: eager — this is the first paint for shoppers.
import MainPage from "./mainpage/main.jsx"
import ErrorPage from './public/error-page.jsx';
import Cart from './cart/main.jsx';
import Outfit from './outfit/main.jsx';
import ConfirmOrder from './cart/confirmOrder.jsx';
import PlaceOrder from './cart/placeOrder.jsx';
import CheckOut from './checkout/main.jsx';

// Back-office path: lazy — shoppers never download the admin bundle.
const Admin = lazy(() => import('./admin/main.jsx'));
const Login = lazy(() => import('./admin/login.jsx'));
const Order = lazy(() => import('./admin/order/main.jsx'));
const Inventory = lazy(() => import('./admin/inventory/main.jsx'));
const Favorite = lazy(() => import('./admin/favorite/main.jsx'));
const Profit = lazy(() => import('./admin/static/main.jsx'));
const UpdateMeasurements = lazy(() => import('./admin/inventory/form/update-measurement.jsx'));
const EditItem = lazy(() => import('./admin/inventory/form/edit-item.jsx'));
const CreateItem = lazy(() => import('./admin/inventory/form/create-item.jsx'));
const DeleteFile = lazy(() => import('./admin/inventory/form/delete-item.jsx'));

import { InventoryProvider } from './public/inventoryContext.jsx';
import { CartProvider } from './public/cartContext.jsx';
import { AuthProvider } from './public/authContext.jsx'
import { WebSocketProvider } from './public/webSocket.jsx';
import { OutfitProvider } from './public/outfitContext.jsx';

import './index.css'

import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})

// Wrap a lazy element in a Suspense boundary so the chunk can load.
const lazyEl = (C) => (
  <Suspense fallback={<div className="route-loading" />}>
    {createElement(C)}
  </Suspense>
);


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
          path: "/login",
          element: lazyEl(Login),
        },
        {
          path: "admin",
          element: lazyEl(Admin),
          children: [
            {
              path: "favorite",
              element: lazyEl(Favorite),
            },
            {
              path: "order",
              element: lazyEl(Order),
            },
            {
              path: "static",
              element: lazyEl(Profit),
            },
            {
              path: "inventory",
              element: lazyEl(Inventory),
              children: [
                {
                  path: "",
                  element: lazyEl(UpdateMeasurements),
                },
                {
                  path: "create/:folderId",
                  element: lazyEl(CreateItem),
                },
                {
                  path: "edit/:itemId",
                  element: lazyEl(EditItem),
                },
                {
                  path: "delete/:itemId",
                  element: lazyEl(DeleteFile),
                },
              ]
            },
          ]
        }
      ],
    },
  ]);

  return (

    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>
          <InventoryProvider>
            <OutfitProvider>
              <CartProvider>
                <RouterProvider router={router} />
                <Analytics />
              </CartProvider>
            </OutfitProvider>
          </InventoryProvider>
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>

  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
