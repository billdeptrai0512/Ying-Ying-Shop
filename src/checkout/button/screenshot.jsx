import domtoimage from "dom-to-image";
import styles from "../checkout.module.css";
import { Camera } from 'lucide-react';

export default function ScreenShotButton() {
    // screenShot button components
    const takeScreenshot = () => {
        const element = document.querySelector("#screenshot-area");
    
        domtoimage.toPng(element)
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = `yingying-qr`; // File name for the screenshot
                link.href = dataUrl;
                link.click(); // Trigger download
            })
            .catch((error) => {
                console.error("Failed to capture screenshot:", error);
            });
    };

    return (
        <div style={{ textAlign: "center", margin: "1rem" }}>
            <button style={{backgroundColor: "#331D1C", width: "fit-content", margin: "0 auto", padding: "0.5em", display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "50%", marginBottom:"0.5em", cursor: "pointer"}}
                onClick={takeScreenshot}
            >
                <Camera size={20} color="#FFFFFF"  />
            </button>
            <p className={styles.copyable}>
                Lưu ảnh
            </p>
        </div>
    )
    
}