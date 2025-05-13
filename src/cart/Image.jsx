import { useRef, useState } from 'react';
import styles from './Cart.module.css';
import { Play } from 'lucide-react'; // adjust import if needed

export default function Image({ outfit, index, pickOutFit, removeOutFit, editOutFit }) {
    const scrollRef = useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const entries = Object.entries(outfit)
        .filter(([key, val]) => key !== "total" && val?.item);

    const canScroll = entries.length > 5;

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

    return (
        // <div className={styles.wrapper}>
        //     {canScroll && (
        //         <Play
        //             color="#626262"
        //             onClick={scrollLeft}
        //             style={{
        //                 display: atStart ? 'none' : 'block',
        //                 position: 'absolute',
        //                 transform: 'translateX(-2em) translateY(0.5em) rotate(180deg)'
        //             }}
        //         />
        //     )}

            <div className={styles.row}>
                <div className={styles.set}>
                    <h4>SET {index + 1}</h4>
                    <button className={styles.remove} onClick={() => removeOutFit(outfit)}>XÓA</button>
                </div>

                <div className={styles.outfit} onClick={() => pickOutFit(index)}>
                    <div className={styles.scrollContainer} ref={scrollRef}>
                        {getImages(outfit).map((object, index) => (
                            <div key={`${outfit.id}-${index}`} className={styles.item}>
                                <img
                                    src={object.item.image}
                                    alt={`item-${index}`}
                                />
                                <button
                                    className={styles.edit}
                                    onClick={() => editOutFit(outfit, object.item, object.section || index)}
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        //     {/* {canScroll && (
        //         <Play
        //             color="#626262"
        //             onClick={scrollRight}
        //             style={{
        //                 display: atEnd ? 'none' : 'block',
        //                 position: 'absolute',
        //                 transform: 'translateX(30.5em) translateY(0.5em)'
        //             }}
        //         />
        //     )} */}
        // </div>
    );
}