import { useOutfit } from "../public/outfitContext";

import Category from "./category";

export default function Inventory({ inventory,
                                missingSize, setMissingSize, 
                                bottomSection, jacketSection,
                                setBottomSection, setJacketSection,
                                resetTrigger , onImageLoad}) {

  const { setOutFit, setSelectedItem } = useOutfit();

  const updateOutFit = (item, section) => {
        
      setOutFit(prev => {

          if (section === "extra") {
            return handleExtraSection(item, prev);
          }
    
          const currentItem = prev[section]?.item;
    
          if (currentItem?.id === item.id) {
            return {
              ...prev,
              [section]: { item: null, size: null },
              total: prev.total - currentItem.total,
            };
          }
    
          return {
              ...prev,
              [section]: { item, size: null },
              total: prev.total - (currentItem?.total || 0) + item.total,
          };

        });

      setSelectedItem(item); // Save the selected item
  };

  const updateSize = (section, size) => {
      setOutFit(prev => ({
          ...prev,
          [section]: {
              ...prev[section],
              size,
          }
      }));
  };

  const sorted = [...inventory].sort(
    (a, b) => sortOrder.indexOf(a.section) - sortOrder.indexOf(b.section)
  );
    
  return (
    <>
      {sorted.map((inventory, index) => (
        <Category key={index} 
          inventory={inventory} 
          updateOutFit={updateOutFit} 
          updateSize={updateSize} 
          missingSize={missingSize} 
          setMissingSize={setMissingSize} 
          bottomSection={bottomSection} 
          jacketSection={jacketSection}
          setBottomSection={setBottomSection} 
          setJacketSection={setJacketSection}
          resetTrigger={resetTrigger} 
          onImageLoad={onImageLoad}
        />
      ))}
    </>
  );
}

const sortOrder = ["top", "bottom", "sweater", "jacket", "extra"];

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
