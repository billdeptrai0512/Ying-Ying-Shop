import { Copy } from 'lucide-react';

export default function CopyButton({ value }) {

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        alert(`Copied ${value} to clipboard!`);
    };

    return <Copy size="12px" style={{ cursor: "pointer" }} onClick={handleCopy} />;

}
