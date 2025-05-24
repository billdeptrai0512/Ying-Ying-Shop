import Item from "./item";
import { useAuth } from "../public/authContext"
import { Link } from "react-router-dom"

export default function Folder({ folder, loading,
                                updateOutFit, updateSize,
                                missingSize, setMissingSize, 
                                bottomSection, jacketSection,
                                resetTrigger }) {

    const { user } = useAuth()
    
    return (
      <>
        {user ? <Link to={`/folder`}>Add new folder</Link> : null}
        {folder.map((inventory, index) => (
          <Item key={index} folderId={inventory.id} loading={loading} inventory={inventory} 
          updateOutFit={updateOutFit} updateSize={updateSize} 
          missingSize={missingSize} setMissingSize={setMissingSize} 
          bottomSection={bottomSection} jacketSection={jacketSection}
          resetTrigger={resetTrigger} 
          />
        ))}
      </>
    );
  }