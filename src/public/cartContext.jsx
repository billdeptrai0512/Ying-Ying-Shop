import { createContext, useContext, useState } from 'react';

const CartContext = createContext()

export function CartProvider({ children }) {

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

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);