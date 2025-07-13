import { createContext, useContext, useState } from 'react';

const CartContext = createContext()

export function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  const saveOutFit = (outfit) => {

    setCart(prevCart => [...prevCart, outfit]);
 
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