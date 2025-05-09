import Item from "./item"
import { useFolder } from "../public/folderContext"
import { useAuth } from "../public/authContext"
import { Link } from "react-router-dom"

export default function Folder() {

    const { user } = useAuth()
    const { folder } = useFolder()

    return (
      <>
        {/* add new folder here */}
        {user ? <Link to={`/folder`}>Add new folder</Link> : null}
        {folder.map((inventory, index) => (
          <Item key={index} folderId={inventory.id} inventory={inventory} />
        ))}
      </>
    );
  }