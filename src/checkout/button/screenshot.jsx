import domtoimage from "dom-to-image";
import styles from "../checkout.module.css";
import { Camera } from 'lucide-react';

export default function ScreenShotButton() {
    const takeScreenshot = () => {
        const element = document.querySelector("#screenshot-area");

        domtoimage.toPng(element, { bgcolor: '#F0E4E2' })
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = `yingying-qr`;
                link.href = dataUrl;
                link.click();
            })
            .catch((error) => {
                console.error("Failed to capture screenshot:", error);
            });
    };

    return (
        <button className={styles.actionBtn} onClick={takeScreenshot}>
            <Camera size={20} />
            <span>Chụp ảnh</span>
        </button>
    );
}