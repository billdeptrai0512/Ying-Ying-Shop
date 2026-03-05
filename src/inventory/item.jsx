import { useState } from "react";
import { useOutfit } from "../public/outfitContext";
import imageCover from "./../assets/tickweb.png"
import React from "react";

export default function ListItem({ inventory, section, extraType, itemRefs, onImageLoad }) {

    const { outFit, updateOutFit } = useOutfit()

    const selected = section !== "extra" ? outFit?.[section]?.item : outFit?.[section]?.[extraType]?.item;

    const itemList = inventory.sort((a, b) => a.displayID - b.displayID)

    const borderStyle = (item) => ({
        position: "relative",
        border: selected?.id === item.id ? '2px solid #331D1C' : 'none'
    });

    return itemList.map((item) => (
        <ImageItem
            key={item.id}
            item={item}
            selected={selected}
            section={section}
            itemRefs={itemRefs}
            updateOutFit={updateOutFit}
            onImageLoad={onImageLoad}
        />
    ))
}

function ImageItem({ item, selected, section, itemRefs, updateOutFit, onImageLoad }) {
    const [loaded, setLoaded] = useState(false);

    const borderStyle = {
        position: "relative",
        border: selected?.id === item.id ? '2px solid #331D1C' : 'none'
    };

    const skeletonStyle = {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)",
        backgroundSize: "200% 100%",
        animation: loaded ? "none" : "shimmer 1.2s infinite",
        opacity: loaded ? 0 : 1,
        transition: "opacity 0.3s ease",
    };

    const imgStyle = {
        display: "block",
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.3s ease",
    };

    return (
        <div
            onClick={() => {
                googleTrackingPickItem();
                updateOutFit(item, section);
            }}
            ref={(el) => itemRefs.current[item.id] = el}
            style={borderStyle}
        >
            {/* Skeleton shimmer shown while image loads */}
            <div style={skeletonStyle} aria-hidden="true" />

            {selected?.id === item.id && (
                <img src={imageCover} alt="selectedItem"
                    style={{ position: "absolute", bottom: "0", right: "0" }}
                />
            )}

            <img
                src={item.image}
                alt={item.name}
                style={imgStyle}
                onLoad={() => {
                    setLoaded(true);
                    onImageLoad?.();
                }}
                onError={() => {
                    setLoaded(true); // Don't block loading screen on broken images
                    onImageLoad?.();
                }}
            />
        </div>
    );
}

// googleTrackingPickItem()
const googleTrackingPickItem = () => {

    let count = parseInt(sessionStorage.getItem('pickItem') || '0', 10);
    count++;
    sessionStorage.setItem('pickItem', count);

    return window.gtag('event', 'click', {
        event_category: 'Button',
        event_label: 'pick an item',
        click_count: count,
    });
}