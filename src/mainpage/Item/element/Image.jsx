import { useRef, useState } from "react"
import imageCover from "../../../assets/khung_item.png"
import DesktopStyles from "../Item.module.css"
import MobileStyles from "../MobileItem.module.css"
import { Play } from "lucide-react"
import { useCart } from "../../../main"

export default function Image({name, inventory, selectedItem, pickItem}) {

    const scrollContainer = useRef(null)
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const { isMobile } = useCart()

    const styles = isMobile ? MobileStyles : DesktopStyles

    const updateScrollLimits = () => {
        if (!scrollContainer.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
        setAtStart(scrollLeft <= 0);
        setAtEnd(scrollLeft + clientWidth >= scrollWidth);
    };

    const scrollLeft = () => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: -168, behavior: "smooth" });
            setTimeout(updateScrollLimits, 300)
        }
    };

    const scrollRight = () => {
        
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: 168, behavior: "smooth" });
            setTimeout(updateScrollLimits, 300)
        }
    };

    return (
        <div className={styles.container}>
            {inventory.length > 5 ? (
                <>
                    <Play color="#331D1C" onClick={scrollLeft} 
                        style={{ 
                            display: atStart === true ? 'none' : 'block',
                            position: "absolute", 
                            transform: "translateX(-150%) rotate(180deg)"
                        }} />
                        
                    <div className={styles.image} ref={scrollContainer}>
                        
                        {inventory.map((item, index) => (
                            <div key={index} onClick={() => pickItem(index, inventory)}> 
                                {selectedItem === item ? <img src={imageCover} alt="selectedItem"></img> : null}
                                <img src={item.image} alt={name}></img>
                            </div>
                        ))}

                    </div>

                    <Play color="#331D1C" onClick={scrollRight} 
                        style={{ 
                            display: atEnd === true ? 'none' : 'block',
                            position: "absolute",
                            transform: isMobile ? "translateX(83vw)" : "translateX(-20%)" 
                        }} />
                </>
            )
            :
            (
                <div className={styles.image} ref={scrollContainer}>
                        
                    {inventory.map((item, index) => (
                        <div key={index} onClick={() => pickItem(index, inventory)}> 
                            {selectedItem === item ? <img src={imageCover} alt="selectedItem"></img> : null}
                            <img src={item.image} alt={name}></img>
                        </div>
                    ))}
                    
                </div>
            )}
        </div>
    )
}