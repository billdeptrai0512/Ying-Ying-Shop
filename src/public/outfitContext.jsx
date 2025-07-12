import { useContext, createContext, useState, useEffect } from "react";

const OutfitContext = createContext();

export function OutfitProvider({ children }) {

    const [missingSize, setMissingSize] = useState(null);
    const [resetTrigger, setResetTrigger] = useState(false);

    // outfit could return not undefined but empty
    const [outFit, setOutFit] = useState(() => {
        try {
            const savedOutfit = sessionStorage.getItem("outFit")
            return savedOutfit ? JSON.parse(savedOutfit) : defaultOutfit;
        } catch (e) {
            console.warn("Failed to parse saved outfit:", e);
            return defaultOutfit;
        }
    });

    const [selectedItem, setSelectedItem] = useState(() => {
        const savedSelectedItem = sessionStorage.getItem("selectedItem");
        return savedSelectedItem ? JSON.parse(savedSelectedItem) : defaultSelectedItem;
    });

    const updateOutFit = (item, section) => {
        
        setOutFit(prev => {
  
            if (section === "extra") {
              return handleExtraSection(item, prev);
            }
      
            const currentItem = prev[section]?.item;
            const sameItem = currentItem?.id === item.id

            if (sameItem) {
                //remove the item out of the outfit + subtract the total
                return {
                    ...prev,
                    [section]: { item: null, size: null },
                    total: prev.total - currentItem.total,
                };
            }
      
            return {
                //add the item to the outfit + plus or replace the with the new total
                ...prev,
                [section]: { item, size: null },
                total: prev.total - (currentItem?.total || 0) + item.total,
            };
  
          });
  
        updateSelectedItem(item, section); // Save the selected item
        // we return a selectedItem by any mean
    };

    const updateSelectedItem = (item, section) => {
        
        setSelectedItem(prev => {
  
            if (section === "extra") {
              return handleExtraSection(item, prev);
            }
      
            const currentItem = prev[section]?.item;
            const sameItem = currentItem?.id === item.id

            if (sameItem) {
                //remove the item out of the selected 
                return {
                    ...prev,
                    [section]: { item: null },
                };
            }
      
            return {
                //add the item to the selected 
                ...prev,
                [section]: { item },
            };
  
        });
    };

    const getSelectedItem = (section) => {

        if (!selectedItem[section]) return

        const item = selectedItem[section].item

        return item

    }

    const updateSize = (section, size) => {
        setOutFit(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                size,
            }
        }));
    };

    const resetOutfit = () => {

        setOutFit(defaultOutfit);
        setSelectedItem(defaultSelectedItem);

        //these 3 below atribute is from the outfit object
        setMissingSize(null);
        setResetTrigger((prev) => !prev);
    };

    useEffect(() => {
        // Save outfit state to sessionStorage whenever it changes
        sessionStorage.setItem("outFit", JSON.stringify(outFit));
    }, [outFit]);

    useEffect(() => {
        // Save selectedItem state to sessionStorage whenever it changes
        sessionStorage.setItem("selectedItem", JSON.stringify(selectedItem));
    }, [selectedItem]);

    return (
        <OutfitContext.Provider value={{ outFit, setOutFit,
            updateOutFit, resetOutfit, 
            selectedItem, updateSelectedItem,
            getSelectedItem,
            updateSize, missingSize, 
            resetTrigger }}>
            {children}
        </OutfitContext.Provider>
    );
}

const defaultOutfit = {
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
}

const defaultSelectedItem = {
    id: defaultOutfit.id,
    top: { item: null},
    bottom: { item: null},
    sweater: { item: null},
    jacket: { item: null},
    extra: {
        neck: { item: null},
        bag: { item: null},
    },
    total: 0,
}

const handleExtraSection = (item, prev) => {
    const current = item.type === "bow" || item.type === "tie"
      ? prev.extra.neck.item
      : prev.extra[item.type]?.item;
  
    const isSameItem = current?.id === item.id;
    const itemField = (item.type === "bow" || item.type === "tie") ? "neck" : item.type;
  
    return {
      ...prev,
      extra: {
        ...prev.extra,
        [itemField]: { item: isSameItem ? null : item }
      },
      total: prev.total - (current?.total || 0) + (isSameItem ? 0 : item.total)
    };
};
  

// eslint-disable-next-line react-refresh/only-export-components
export const useOutfit = () => useContext(OutfitContext);
