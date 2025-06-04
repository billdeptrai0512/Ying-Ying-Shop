import domtoimage from "dom-to-image";
import styles from "./checkout.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy, Heart, Camera, Facebook} from 'lucide-react';

const formatCurrency = (value) => {
    if (!value) value = 0
    const intValue = Math.floor(value);
    return intValue.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,") + "đ";
};

export default function Bill({total, order}) {

    const handleCopy = (text) => {
        console.log(`Copied: ${text}`);
        alert("Copied to clipboard!");
    };

    const takeScreenshot = () => {
        const element = document.querySelector("#screenshot-area");
    
        domtoimage.toPng(element)
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = "screenshot.png"; // File name for the screenshot
                link.href = dataUrl;
                link.click(); // Trigger download
            })
            .catch((error) => {
                console.error("Failed to capture screenshot:", error);
            });
    };


    if (order.paid_status === true) {
        return (
            <div id="screenshot-area">
                <div style={{ display: "flex", flexDirection:"column", justifyContent: "center", alignItems:"center", backgroundColor: "#453130", minHeight: "20em", gap:"0.5em", margin: "3em" }}> 
                    <Heart size={60} color="#E3C4C1" style={{ marginBottom: "2em"}}/>
                    <h2 style={{fontSize: "1.2em", color: "#FFFFFF"}}>THANH TOÁN THÀNH CÔNG</h2>
                    <h3 style={{fontSize: "1em", color: "#FFE1E1", fontWeight: "700"}}> TỔNG TIỀN: 250.000đ</h3>
                    <p style={{fontSize: "0.8em", color: "#FFE1E1",  fontWeight: "700"}}>#90</p>
                </div>

                <div style={{display: "flex", flexDirection: "row", gap: "1rem", textAlign: "center", justifyContent: "center"}}>
                    <div style={{width: "75%"}}>
                        <p className={styles.copyable}>
                            Bạn vui lòng chụp màn hình rồi gửi về Fanpage
                            để shop chuẩn bị đơn cho mình nha ❤️
                        </p>
                        {/* <div style={{display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1em"}}>
                            <Facebook size={25} />
                            <p className={styles.copyable}>
                                www.fb.com/yingyingcosshop
                            </p>
                            <Copy size={"12px"}/>
                        </div> */}
                    </div>
                </div>
    
                <div style={{ textAlign: "center", margin: "1rem" }}>
                    <div style={{backgroundColor: "#331D1C", width: "fit-content", margin: "0 auto", padding: "0.5em", display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "50%", marginBottom:"0.5em", cursor: "pointer"}}
                        onClick={takeScreenshot}
                    >
                        <Camera size={20} color="#FFFFFF"  />
                    </div>
                    <p className={styles.copyable}>
                        Lưu ảnh
                    </p>
                </div>
    

            </div>
        );
    } else {
        return (
            <div id="screenshot-area">
                <div style={{ textAlign: "center" }}> 
                    <img
                        id="qr-code"
                        src={`https://qr.sepay.vn/img?acc=20495991&bank=ACB&amount=${total}&des=YS${order.id}&template=compact`}
                        style={{ width: "70%" }}
                        alt="QR Code"
                        crossOrigin="anonymous"
                    />
                </div>
    
                <div style={{ textAlign: "center", margin: "1rem", backgroundColor: "#E3C4C1" }}>
                    <h3 style={{ color: "#FFFFFF", padding: "0.5em", fontSize: "1.1em"}}>{`Đơn hàng: ${order.id}`}</h3>
                </div>
    
                <div style={{display: "flex", flexDirection: "row", gap: "1rem" , justifyContent: "space-around"}}>
                    <div>
                        <p className={styles.copyable}>
                            Ngân hàng : ACB
                        </p>
                        <div style={{display: "flex", gap: "0.5rem"}}>
                            <p className={styles.copyable}>
                                STK: 20495991
                            </p>
                            <CopyToClipboard text="20495991" style={{ cursor: "pointer" }} onCopy={() => handleCopy("20495991")}>
                                <Copy size={"12px"}  />
                            </CopyToClipboard>
                        </div>
                        
                        <p className={styles.copyable}>
                            NGUYEN HOANG DIEU ANH
                        </p>
                    </div>
    
                    <div style={{display: "flex", flexDirection: "column"}}>
                        
                        <div style={{display: "flex", gap: "0.5rem"}}>
                            <p className={styles.copyable}>
                                Tổng tiền: {formatCurrency(total)} 
                            </p>
                            <CopyToClipboard text={formatCurrency(total)} style={{ cursor: "pointer" }} onCopy={() => handleCopy(formatCurrency(total))}>
                                <Copy size={"12px"}  />
                            </CopyToClipboard>
                        </div>
    
                        <div style={{display: "flex", gap: "0.5rem"}}>
                            <p className={styles.copyable}>
                                Nội dung: YY{order.id}
                            </p>
                            <CopyToClipboard text={`YY${order.id}`}  style={{ cursor: "pointer" }} onCopy={() => handleCopy(`YY${order.id}`)}>
                                <Copy size={"12px"} />
                            </CopyToClipboard>
                        </div>
                        
                    </div>
    
                </div>

                <div style={{ textAlign: "center", margin: "1rem" }}>
                    <div style={{backgroundColor: "#331D1C", width: "fit-content", margin: "0 auto", padding: "0.5em", display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "50%", marginBottom:"0.5em", cursor: "pointer"}}
                        onClick={takeScreenshot}
                    >
                        <Camera size={20} color="#FFFFFF"  />
                    </div>
                    <p className={styles.copyable}>
                        Lưu ảnh
                    </p>
                </div>
            </div>
        );
    }


}