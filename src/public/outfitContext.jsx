import { useContext, createContext, useState, useEffect } from "react";

const OutfitContext = createContext();

export function OutfitProvider({ children }) {
    const [outFit, setOutFit] = useState(() => {
        // Load initial state from sessionStorage
        const savedOutfit = sessionStorage.getItem("outFit");
        return savedOutfit
            ? JSON.parse(savedOutfit)
            : {
                  id: Math.random(),
                  top: { item: null, size: null },
                  bottom: { item: null, size: null },
                  sweater: { item: null, size: null },
                  jacket: { item: null, size: null },
                  extra: {
                      neck: { item: null },
                      bag: { item: null },
                  },
                  total: 0,
              };
    });

    const [selectedItem, setSelectedItem] = useState(() => {
        const savedSelectedItem = sessionStorage.getItem("selectedItem");
        return savedSelectedItem ? JSON.parse(savedSelectedItem) : null;
    });

    useEffect(() => {
        // Save outfit state to sessionStorage whenever it changes
        sessionStorage.setItem("outFit", JSON.stringify(outFit));
    }, [outFit]);

    useEffect(() => {
        // Save selectedItem state to sessionStorage whenever it changes
        sessionStorage.setItem("selectedItem", JSON.stringify(selectedItem));
    }, [selectedItem]);

    const getSelectedItemBySection = (section) => {
        if (!outFit || !outFit[section]) return null;
        
        if (section === "extra") {
            const neckItem = outFit.extra.neck.item;
            const bagItem = outFit.extra.bag.item;
           
            return {
                neck: neckItem ? neckItem : null,
                bag: bagItem ? bagItem : null,
            };

        } else {
            return outFit[section].item;
        }
        
    };

    return (
        <OutfitContext.Provider value={{ outFit, setOutFit, selectedItem, setSelectedItem, getSelectedItemBySection }}>
            {children}
        </OutfitContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOutfit = () => useContext(OutfitContext);
