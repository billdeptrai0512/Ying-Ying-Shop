import Item from "./item";

export default function Folder({ inventory,
                                updateOutFit, updateSize,
                                missingSize, setMissingSize, 
                                bottomSection, jacketSection,
                                setBottomSection, setJacketSection,
                                resetTrigger }) {

    const sortedInventory = inventory.sort((a, b) => {
      const order = ["top", "bottom", "sweater", "jacket", "extra"];
      return order.indexOf(a.section) - order.indexOf(b.section);
    });
    
    
    return (
      <>
        {sortedInventory.map((inventory, index) => (
          <Item key={index} folderId={inventory.id} inventory={inventory} 
          updateOutFit={updateOutFit} updateSize={updateSize} 
          missingSize={missingSize} setMissingSize={setMissingSize} 
          bottomSection={bottomSection} jacketSection={jacketSection}
          setBottomSection={setBottomSection} setJacketSection={setJacketSection}
          resetTrigger={resetTrigger} 
          />
        ))}
      </>
    );
  }