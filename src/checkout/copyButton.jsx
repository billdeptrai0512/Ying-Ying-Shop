import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy} from 'lucide-react';


export default function CopyButton({value}) {

    const handleCopy = (value) => {
        alert(`Copied ${value} to clipboard!`);
    };

    return (
        
        <CopyToClipboard text={value} style={{ cursor: "pointer" }} onCopy={() => handleCopy(value)}>
            <Copy size={"12px"}  />
        </CopyToClipboard>

    );
    


}