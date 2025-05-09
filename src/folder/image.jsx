import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import imageCover from "./../assets/khung_item.png"
import styles from "./Item.module.css"
import { Play } from "lucide-react"
import { useAuth } from "../public/authContext"
import DeleteFile from "../form/delete-file"
import FileEdit from "../form/save-file"


export default function Image({name, inventory, selectedItem, pickItem}) {

    const { user } = useAuth()

    const scrollContainer = useRef(null)
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

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
        <div className={styles.image}>

            {/* <Play color="#331D1C" onClick={scrollLeft} 
                        style={{ 
                            display: atStart === true ? 'none' : 'block',
                            position: "absolute", 
                            transform: "translateX(-150%) rotate(180deg)"
            }} /> */}

            <div className={styles.row} ref={scrollContainer}>
                
                {inventory.map((item, index) => (

                    <>
                        <div key={index} onClick={() => pickItem(index, inventory)} style={{ position: "relative" }}> 
                            {/* cover */}
                            {/* {selectedItem === item ? <img src={imageCover} alt="selectedItem" style={{ position: "absolute" }}></img> : null} */}
                            {/* image */}
                            <img src={item.image} alt={name}></img>
                            {/* <img src={item.demo_image} alt={name}></img> */}
                            {/* delete/edit button for admin */}    
                            
                        </div>
                        {user ? <Link to={`/file/${item.id}`}>Edit</Link> : null}
                    </>
                
                ))}

            </div>

            
            {/* <Play color="#331D1C" onClick={scrollRight} 
                    style={{ 
                            display: atEnd === true ? 'none' : 'block',
                            position: "absolute",
                            transform: "translateX(-20%)" 
            }} /> */}

            {/* {inventory.length > 5 ? (
                <>
                    <Play color="#331D1C" onClick={scrollLeft} 
                        style={{ 
                            display: atStart === true ? 'none' : 'block',
                            position: "absolute", 
                            transform: "translateX(-150%) rotate(180deg)"
                        }} />
                        
                    <div className={styles.imageRow} ref={scrollContainer}>
                        
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
                <div className={styles.imageRow} ref={scrollContainer}>
                        
                    {inventory.map((item, index) => (
                        <div key={index} onClick={() => pickItem(index, inventory)}> 
                            {selectedItem === item ? <img src={imageCover} alt="selectedItem"></img> : null}
                            <img src={item.image} alt={name}></img>
                        </div>
                    ))}
                    
                </div>
            )} */}
        </div>
    )
}