import { useState, useEffect, useRef } from "react"
import sizeCover from "../../../assets/khung_size.png"
import DesktopStyles from "../Item.module.css"
import MobileStyles from "../MobileItem.module.css"
import { useCart } from "../../../main"

export default function Size({category, selectedItem, isChoosen, itemSection, UpdateSize, sizeSelected, setSizeSelected, missingSize, isMissingSize, setMissingSize}) {

    const [isHovered, setIsHovered] = useState(false)
    const [position, setPosition] = useState({x: 0, y:0})
    const hoverTimeoutRef = useRef(null);
    const { isMobile } = useCart()
    const styles = isMobile ? MobileStyles : DesktopStyles
    
    const pickSize = (index) => {
        
        setSizeSelected((prev) => {

            if (prev === index) {

                return null

            } else {

                return index
                
            }
            
        })
    };

    useEffect(() => {

        sizeSelected === null ? UpdateSize(category, null) : UpdateSize(category, selectedItem.size[sizeSelected])

        if (isMissingSize) {

            const missingSizes = missingSize.filter(item => item !== category)

            setMissingSize(missingSizes)
        }
            
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sizeSelected])

    useEffect(() => setSizeSelected(null), [selectedItem, setSizeSelected]);

    const handleMouseEnter = (e) => {

        setPosition({ x: e.clientX, y: e.clientY });

        if (!isHovered) {

            hoverTimeoutRef.current = setTimeout(() => {
                setIsHovered(true);
            }, 240);
        }

    }

    const handleMouseLeave = () => {
        clearTimeout(hoverTimeoutRef.current)
        setIsHovered(false)
    }

    const isOpen = selectedItem && isChoosen === itemSection

    if (!isOpen) return null

    const buttonStyle = {
        border: isMissingSize ? "1px solid red" : "1px solid gray",
        animation: isMissingSize ? "shake 0.3s infinite" : "none",
    };

    return (
        <div className={styles.size}>
            <h3> Size </h3>
            <div className={styles.wrapper}>
                <div className={styles.options}>
                    {selectedItem.size.map((size, index) => (
                        <div key={index} >
                            {sizeSelected === index ? (<img src={sizeCover} alt="selectedSize"></img>) : null}
                            <div   
                                style={buttonStyle}
                                onClick={() => pickSize(index)}
                                onMouseEnter={(e) => handleMouseEnter(e)}
                                onMouseLeave={() => handleMouseLeave()}
                                >{size}
                            </div>
                        </div>
                    ))}
                </div>
                {isMissingSize ? <div className={styles.warning}> * chon size ban oi</div> : null}
            </div>
            {isHovered && (
                <div
                    style={{
                        position: "fixed",
                        top: position.y + 12,
                        left: position.x + 12,
                        backgroundColor: "#444444",
                        color: "white",
                        padding: "7px",
                        borderRadius: "8px",
                        pointerEvents: "none",
                        whiteSpace: "nowrap", // Prevents blocking other elements
                    }}
                    >
                    Vai 39 - Ngực 90 - Dài 62
                </div>
            )}
        </div> 
    )
}