import styles from "./Body.module.css"
const facebookLink = "https://www.facebook.com/media/set/?set=a.122106501296570424&type=3"
import empty from "../assets/hinh_tron.png"
import empty2 from "../assets/hinh_tron.png"


const buttonStyle = (value) => {
    return {
        zIndex: value.item.zIndex || 0
    }
}

export default function Demo({outFit}) {

    const selectedOutFit = Object.entries(outFit)
        .filter(([key, value]) => key !== "total" && value?.item?.demoImage)
        .map(([key, value], index) => (
            <img 
                key={`${key}-${index}`} 
                style={buttonStyle(value)}
                src={value.item.demoImage} 
                alt={key} 
            />
        ));
    
    return (
        <div className={styles.board}>
            <div className={styles.demo}>
                {selectedOutFit.length > 0 ? selectedOutFit : null}
            </div>
            <div className={styles.example}> 
                Bấm vào <a href={facebookLink} target="_blank" rel="noopener noreferrer"> đây</a> tham khảo nếu bạn bí ý tưởng nha 😉
            </div>
        </div>
    )
}