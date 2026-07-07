import { useRef, useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { SquareMinus, Play } from 'lucide-react'; // adjust import if needed
import Imgix from 'react-imgix';
import styles from './cart.module.css';

// Largest rendered thumbnail size across breakpoints (cart.module.css .cart_container grid-auto-columns).
const THUMB_WIDTH = 68;

export default function Image({ outfit, index, pickOutFit, removeOutFit, editOutFit, paidStatus }) {


    const scrollRef = useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const isMobile = useMediaQuery({ query: '(max-width: 468px)' });

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
                images.push({ section: key, item: value.item });
            }

            // If it's the 'extra' category, loop its sub-categories
            if (key === "extra") {
                for (const [, subValue] of Object.entries(value)) {
                    if (subValue?.item?.image) {
                        images.push({ section: key, item: subValue.item });
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

                {!paidStatus ? (
                    <button className={styles.remove} onClick={() => removeOutFit(outfit)}>XÓA</button>
                ) : null}


            </div>

            <div className={styles.outfit} onClick={() => pickOutFit(index)}>

                {!isMobile ? (
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
                ) : null}

                <div className={styles.cart_container} ref={scrollRef}>
                    {getImages(outfit).map((object, index) => (
                        <Thumb
                            key={`${outfit.id}-${index}`}
                            object={object}
                            index={index}
                            outfit={outfit}
                            paidStatus={paidStatus}
                            editOutFit={editOutFit}
                        />
                    ))}
                </div>

                {!isMobile ? (
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
                ) : null}


            </div>
        </div>


    );
}

function Thumb({ object, index, outfit, paidStatus, editOutFit }) {
    const [loaded, setLoaded] = useState(false);

    const skeletonStyle = {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)',
        backgroundSize: '200% 100%',
        animation: loaded ? 'none' : 'shimmer 1.2s infinite',
        opacity: loaded ? 0 : 1,
        transition: 'opacity 0.3s ease',
    };

    const imgStyle = {
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.3s ease',
    };

    return (
        <div className={styles.item} style={{ aspectRatio: '1' }}>
            <div style={skeletonStyle} aria-hidden="true" />

            <Imgix
                src={object.item.image}
                width={THUMB_WIDTH}
                imgixParams={{ auto: 'format,compress' }}
                htmlAttributes={{
                    alt: `item-${index}`,
                    style: imgStyle,
                    loading: 'lazy',
                    decoding: 'async',
                    onLoad: () => setLoaded(true),
                    onError: () => setLoaded(true),
                }}
            />

            {!paidStatus ? (
                <button
                    className={styles.edit}
                    onClick={() => editOutFit(outfit, object.item, object.section || index)}>
                    <SquareMinus size={14} />
                </button>
            ) : null}
        </div>
    );
}