import { useRef, useState, useEffect } from 'react';
import styles from './cart.module.css';
import { SquareMinus, Play  } from 'lucide-react'; // adjust import if needed

export default function Image({ outfit, index, pickOutFit, removeOutFit, editOutFit }) {
    const scrollRef = useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const updateScrollLimits = () => {
        const el = scrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setAtStart(scrollLeft <= 0);
        setAtEnd(scrollLeft + clientWidth >= scrollWidth);
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -198, behavior: 'smooth' });
            setTimeout(updateScrollLimits, 300);
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 198, behavior: 'smooth' });
            setTimeout(updateScrollLimits, 300);
        }
    };

    const getImages = (outfit) => {

        const images = [];
    
        // Loop through top-level keys
        for (const [key, value] of Object.entries(outfit)) {
            if (key === "total") continue;
    
            // If demo_image exists directly
            if (value?.item?.image) {
                images.push({section: key, item: value.item});
            }
    
            // If it's the 'extra' category, loop its sub-categories
            if (key === "extra") {
                for (const [, subValue] of Object.entries(value)) {
                    if (subValue?.item?.image) {
                        images.push({section: key, item: subValue.item});
                    }
                }
            }
        }
    
        return images;
    };

    //i don't think cart need this feature
    // useEffect(() => {
    //     const el = scrollRef.current;
    //     if (!el) return;
    
    //     const handleWheel = (e) => {
    //         if (Math.abs(e.deltaX) === 0 && Math.abs(e.deltaY) > 0) {
    //             // Convert vertical scroll into horizontal
    //             e.preventDefault();
    //             el.scrollBy({ left: e.deltaY });
    //         }
    //     };
    
    //     el.addEventListener('wheel', handleWheel, { passive: false });
    
    //     return () => {
    //         el.removeEventListener('wheel', handleWheel);
    //     };

    // }, []);

    useEffect(() => {

        const scrollEl = scrollRef.current

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

    return (

            <div className={styles.row}>
                <div className={styles.set}>
                    <h3>SET {index + 1}</h3>
                    <button className={styles.remove} onClick={() => removeOutFit(outfit)}>XÓA</button>
                </div>

                <div className={styles.outfit} onClick={() => pickOutFit(index)}>

       
                    <Play
                        color="#626262"
                        onClick={scrollLeft}
                        style={{
                            display: atStart ? 'none' : 'block',
                            position: 'absolute',
                            width: "1em",
                            transform: 'translateX(-1.25em) rotate(180deg)'
                        }}
                    />

                    <div className={styles.cart_container} ref={scrollRef}>
                        {getImages(outfit).map((object, index) => (
                            <div key={`${outfit.id}-${index}`} className={styles.item}>
                                <img
                                    src={object.item.image}
                                    alt={`item-${index}`}/>
                                <button
                                    className={styles.edit}
                                    onClick={() => editOutFit(outfit, object.item, object.section || index)}>
                                    <SquareMinus size={14}/>
                                </button>
                            </div>
                        ))}
                    </div>


                    <Play
                        color="#626262"
                        onClick={scrollRight}
                        className={styles.scrollRight}
                        style={{
                            display: atEnd ? 'none' : 'block',
                            position: 'absolute',
                            width: "1em",
                        }}
                    />


                </div>
            </div>

            
    );
}