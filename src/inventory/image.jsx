import { useCallback, useEffect, useRef, useState } from "react"
import { Play } from "lucide-react"
import { useOutfit } from "../public/outfitContext";
import imageCover from "./../assets/tickweb.png"
import styles from "./folder.module.css"
import React from "react";
import Item from "./item";
import ListItem from "./item";

export default function Image({inventory, section, onImageLoad}) {

    const { selectedItem } = useOutfit()

    const scrollContainer = useRef(null)
    const itemRefs = useRef({});
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const [imagesLoaded] = useState(0)

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

    // apply wheel scroll on mouse
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
        }

    }, [selectedItem, imagesLoaded, inventory.length]);

    if (!inventory || inventory.length === 0) return null;

    return (

        <div className={styles.row} >
            
            { renderScrollLeftButton(inventory, scrollLeft, atStart) }

            <div className={styles.container} ref={scrollContainer} >

                <ListItem inventory={inventory} section={section} itemRefs={itemRefs} />

            </div>

            { renderScrollRightButton(inventory, scrollRight, atEnd) }
                         
        </div>

    )
}

const renderScrollLeftButton = (inventory, scrollLeft, atStart) => {

    const haveEnoughItems = inventory.length > 6 

    if (!haveEnoughItems) return null

    return (
        
        <Play color="#331D1C" fill="#331D1C" onClick={scrollLeft} 
        style={{ 
                display: atStart === true ? 'none' : 'block',
                position: "absolute", 
                alignSelf: "center",
                width: "1em",
                transform: "translateX(-130%) rotate(180deg)"
            }}
        />

    )
}

const renderScrollRightButton = (inventory, scrollRight, atEnd) => {

    const haveEnoughItems = inventory.length > 6 

    if (!haveEnoughItems) return null

    return (
        
        <Play color="#331D1C" fill="#331D1C" onClick={scrollRight} 
        style={{ 
            display: atEnd === false ? 'block' : 'none',
            position: "absolute",
            width: "1em",
            alignSelf: "center",
        }} />

    )
}