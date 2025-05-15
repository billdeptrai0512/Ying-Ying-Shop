import Item from "./item";
import { useFolder } from "../public/folderContext"
import { useAuth } from "../public/authContext"
import { Link } from "react-router-dom"
import { useMediaQuery } from "react-responsive";

export default function Folder({ UpdateOutFit, UpdateSize,
                                missingSize, setMissingSize, 
                                bottomSection, jacketSection,
                                resetTrigger }) {

    const { user } = useAuth()
    const { folder } = useFolder()
    const isDesktop = useMediaQuery({ query: '(min-width: 1400px)'})

    if (isDesktop) {

      const firstSectionItem = folder.filter((inventory) => {
          return inventory.section === 'top' || inventory.section === 'bottom' || inventory.section === 'sweater'
      })

      const secondSectionItem = folder.filter((inventory) => {
        return inventory.section === 'jacket' || inventory.section === 'extra'
      })

      return (
        <>
          {user ? <Link to={`/folder`}>Add new folder</Link> : null}

          <div className="left">
            {firstSectionItem.map((inventory, index) => (
              <Item key={index} folderId={inventory.id} inventory={inventory} 
              UpdateOutFit={UpdateOutFit} UpdateSize={UpdateSize} 
              missingSize={missingSize} setMissingSize={setMissingSize} 
              bottomSection={bottomSection} jacketSection={jacketSection}
              resetTrigger={resetTrigger} 
              />
            ))}
          </div>
          <div className="right">
            {secondSectionItem.map((inventory, index) => (
              <Item key={index} folderId={inventory.id} inventory={inventory} 
              UpdateOutFit={UpdateOutFit} UpdateSize={UpdateSize} 
              missingSize={missingSize} setMissingSize={setMissingSize} 
              bottomSection={bottomSection} jacketSection={jacketSection}
              resetTrigger={resetTrigger} 
              />
            ))}
          </div>

        </>

      )

    } 
    
    return (
      <>
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