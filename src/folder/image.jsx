import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../public/authContext"
import { Settings } from 'lucide-react';
import { Play } from "lucide-react"
import imageCover from "./../assets/tickweb.png"
import styles from "./folder.module.css"
import React from "react";

export default function Image({name, inventory, section, selectedItem, pickItem}) {

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
            scrollContainer.current.scrollBy({ left: -200, behavior: "smooth" });
            setTimeout(updateScrollLimits, 300)
        }
    };

    const scrollRight = () => {
        
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: 200, behavior: "smooth" });
            setTimeout(updateScrollLimits, 300)
        }
    };

    useEffect(() => {
        const el = scrollContainer.current;
        if (!el) return;
    
        const handleWheel = (e) => {
            if (Math.abs(e.deltaX) === 0 && Math.abs(e.deltaY) > 0) {
                // Convert vertical scroll into horizontal
                e.preventDefault();
                el.scrollBy({ left: e.deltaY });
            }
        };
    
        el.addEventListener('wheel', handleWheel, { passive: false });
    
        return () => {
            el.removeEventListener('wheel', handleWheel);
        };

    }, []);

    useEffect(() => {

        if (!scrollContainer.current) return

        const scrollEl = scrollContainer.current
        
        const handleScroll = () => {

            const { scrollLeft, scrollWidth, clientWidth } = scrollEl;

            setAtStart(scrollLeft <= 0);
            setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1); // small buffer for float rounding
        }

        scrollEl.addEventListener('scroll', handleScroll);

        handleScroll();

        return () => {
            scrollEl.removeEventListener('scroll', handleScroll);
        };

    }, [])

    const customWidth = { 
        width: inventory.length < 5 
        ? `calc(${inventory.length}* 4.25rem + ${inventory.length - 1}* 0.75rem)` 
        : `calc(5 * 4.25rem + 4* 0.75rem)`,
    }

    return (
        <div key={inventory.id} className={styles.row} >

            {inventory.length < 6 ? null : (
                <Play color="#331D1C" onClick={scrollLeft} 
                style={{ 
                     display: atStart === true ? 'none' : 'block',
                     position: "absolute", 
                     alignSelf: "center",
                     width: "1em",
                     transform: "translateX(-130%) rotate(180deg)"
                    }}
                />
            )}

            <div className={styles.container} ref={scrollContainer} style={customWidth}>

                {inventory.map((item, index) => (

                    <React.Fragment key={index}>
                        <div onClick={() => pickItem(item, section)} style={{ position: "relative" , border: selectedItem === item ? '2px solid #331D1C' : 'none'}}> 
                            {/* cover */}

                            {selectedItem === item ? <img src={imageCover} alt="selectedItem" style={{ position: "absolute", bottom: "0", right: "0" }}></img> : null}
                            {/* image */}

                            {user ? <Link to={`/file/${item.id}`}>
                                <Settings size={18} style={{position:"absolute", transform:"unset"}}/>
                            </Link> : null}

                            <img src={item.image} alt={name} style={{display: 'block'}}></img>
                        </div>
                    </React.Fragment>

                ))}

            </div>

            {inventory.length < 6 ? null : (
                <Play color="#331D1C" onClick={scrollRight} 
                style={{ 
                    display: atEnd === false ? 'block' : 'none',
                    position: "absolute",
                    width: "1em",
                    alignSelf: "center",
                }} />
            )}
                         
        </div>

    )
}