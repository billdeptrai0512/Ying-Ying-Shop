import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Settings } from 'lucide-react';
import { Play } from "lucide-react"
import imageCover from "./../assets/tickweb.png"
import styles from "./folder.module.css"
import React from "react";

export default function Image({name, inventory, section, selectedItem, pickItem}) {

    
    const scrollContainer = useRef(null)
    const itemRefs = useRef({});
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(0)

    const allImagesLoaded = imagesLoaded === inventory.length;

    const updateScrollLimits = () => {
        if (!scrollContainer.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
        setAtStart(scrollLeft <= 0);
        setAtEnd(scrollLeft + clientWidth >= scrollWidth);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const scrollLeft = useCallback(() => {

        const SCROLL_OFFSET = -72;
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: SCROLL_OFFSET, behavior: "smooth" });
            requestAnimationFrame(updateScrollLimits);

            const currentIndex = inventory.indexOf(selectedItem);
            if (currentIndex > 0) {
                pickItem(inventory[currentIndex - 1], section);
            }
        }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const scrollRight = useCallback(() => {
        
        if (scrollContainer.current) {
            const SCROLL_OFFSET = 72;
            scrollContainer.current.scrollBy({ left: SCROLL_OFFSET, behavior: "smooth" });
            requestAnimationFrame(updateScrollLimits);

            const currentIndex = inventory.indexOf(selectedItem);
            if (currentIndex < inventory.length - 1) {
                pickItem(inventory[currentIndex + 1], section);
            }
        }
    });

    //wheel effect
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
    
    //scroll effect
    useEffect(() => {

        const scrollEl = scrollContainer.current

        if (!scrollEl) return

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

    useEffect(() => {

        if (allImagesLoaded) {
            updateScrollLimits();
        }
        
    }, [allImagesLoaded])

    useEffect(() => {
        if (!selectedItem || imagesLoaded < inventory.length) return;
    
        const el = itemRefs.current[selectedItem.id];
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });
            console.log('Scroll into view:', selectedItem.id);
        }
    }, [selectedItem, imagesLoaded, inventory.length]);



    if (!inventory || inventory.length === 0) return null;

    return (

        <div className={styles.row} >
            {!allImagesLoaded && <div className={styles.loading}>Loading...</div>}

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

            <div className={styles.container} ref={scrollContainer} >

                {inventory.map((item) => (

                    <React.Fragment key={item.id}>
                        <div onClick={() => pickItem(item, section)
                        } 
                            ref={(el) => itemRefs.current[item.id] = el}

                            style={{ position: "relative" , 
                                border: selectedItem?.id === item.id ? '2px solid #331D1C' : 'none'}}> 
                            {/* cover */}

                            {selectedItem?.id === item.id ? <img src={imageCover} alt="selectedItem" style={{ position: "absolute", bottom: "0", right: "0" }}></img> : null}
                            {/* image */}

                            <img src={item.image} alt={name} onLoad={() => setImagesLoaded(prev => prev + 1)} style={{display: 'block'}}></img>
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