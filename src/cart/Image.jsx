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
                        {entries.map(([key, value], imgIndex) => (
                            <div key={`${outfit.id}-${key}`} className={styles.item}>
                                <img
                                    key={`${key}-${imgIndex}`}
                                    style={{ zIndex: value.item.zIndex || 0 }}
                                    src={value.item.image}
                                    alt={key}
                                />
                                <button className={styles.edit} onClick={() => editOutFit(outfit, key)}>x</button>
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