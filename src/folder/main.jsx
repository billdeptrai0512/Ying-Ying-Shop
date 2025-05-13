import Item from "./item";
import { useFolder } from "../public/folderContext"
import { useAuth } from "../public/authContext"
import { Link } from "react-router-dom"

export default function Folder({ UpdateOutFit, UpdateSize,
                                missingSize, setMissingSize, 
                                bottomSection, jacketSection,
                                resetTrigger }) {

    const { user } = useAuth()
    const { folder } = useFolder()
    
    return (
      <>
        {user ? <Link to={`/folder`}>Add new folder</Link> : null}
        {folder.map((inventory, index) => (
          <Item key={index} folderId={inventory.id} inventory={inventory} 
          UpdateOutFit={UpdateOutFit} UpdateSize={UpdateSize} 
          missingSize={missingSize} setMissingSize={setMissingSize} 
          bottomSection={bottomSection} jacketSection={jacketSection}
          resetTrigger={resetTrigger} 
          />
        ))}
      </>
    );
  }