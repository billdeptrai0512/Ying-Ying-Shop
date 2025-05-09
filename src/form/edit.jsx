import { Link } from 'react-router-dom';
import DeleteFile from './delete-file';
import SaveFile from './save-file';

export default function Edit() {

    return (
        <div>
            <SaveFile />
            <DeleteFile />
            <Link to="/" >Cancel </Link>
        </div>
    );
}