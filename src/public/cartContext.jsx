import { createContext, useContext, useState } from 'react';
import { useOutfit } from './outfitContext';

const CartContext = createContext()

export function CartProvider({ children }) {

  const { checkMissingSizes } = useOutfit()

  const [cart, setCart] = useState([]);

  const saveOutFit = (outfit) => {

    const missingSize = checkMissingSizes(outfit)

    if (missingSize) return false

    setCart(prevCart => [...prevCart, outfit]);

    googleTrackingAddToCart()
      
    return true
  };

  const editOutFit = (outfit, item, key) => {

    setCart(prevCart => {

      return prevCart.map(OutFit => {

        if (OutFit.id === outfit.id) {

          const itemPrice = key !== "extra" ? outfit[key].item.total : item.type === "bag" ? outfit[key][item.type].item.total : outfit[key].neck.item.total;

          const newItem = OutFit[key].size ? {item: null, size: null} : {item: null}
          const newTotal = OutFit.total - itemPrice

          if (newTotal === 0) return null

          if (key !== "extra" ) {
              return {
                ...OutFit,
                [key] : newItem,
                total: newTotal,
              }
  
          } else {

            if (item.type !== "bag") {
              return {
                ...OutFit,
                [key]: {
                    ...OutFit[key],
                    neck : newItem,
                },
                total: newTotal,

              }
              } else {

                return {
                  ...OutFit,
                    [key]: {
                        ...OutFit[key],
                        [item.type] : newItem,
                        
                    },
                    total: newTotal,
                }
              }
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

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

const googleTrackingAddToCart = () => {
    
  let count = parseInt(sessionStorage.getItem('addToCart') || '0', 10);

  count++;
  sessionStorage.setItem('addToCart', count);

  return window.gtag('event', 'click', {
      event_category: 'Button',
      event_label: 'add to cart',
      click_count: count,
  });
}
