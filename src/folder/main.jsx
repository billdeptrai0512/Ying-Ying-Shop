import Item from "./item";
import { useAuth } from "../public/authContext"
import { Link } from "react-router-dom"

export default function Folder({ folder,
                                updateOutFit, updateSize,
                                missingSize, setMissingSize, 
                                bottomSection, jacketSection,
                                setBottomSection, setJacketSection,
                                resetTrigger }) {

    const { user } = useAuth()

    const sortedFolder = folder.sort((a, b) => {
      const order = ["top", "bottom", "sweater", "jacket", "extra"];
      return order.indexOf(a.section) - order.indexOf(b.section);
    });
    
    
    return (
      <>
        {user ? <Link to={`/folder`}>Add new folder</Link> : null}
        {sortedFolder.map((inventory, index) => (
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