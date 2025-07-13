import { useOutfit } from "../public/outfitContext";
import imageCover from "./../assets/tickweb.png"
import React from "react";

export default function ListItem({inventory, section, itemRefs}) {

    const { outFit, updateOutFit } = useOutfit()

    const selected = outFit?.[section]?.item;
    
    const itemList = inventory.sort((a,b) => a.displayID - b.displayID)

    const borderStyle = (item) => ({
        position: "relative", 
        border: selected?.id === item.id ? '2px solid #331D1C' : 'none'
    });
    
    return itemList.map((item) => (
                <React.Fragment key={item.id}>
                    <div onClick={() => {
                        googleTrackingPickItem()
                        updateOutFit(item, section)
                    }} 
                        ref={(el) => itemRefs.current[item.id] = el}
                        style={borderStyle(item)}> 
            
                        {renderImageCover(selected, item)}
            
                        <img src={item.image} alt={item.name} style={{display: 'block'}}></img>
                    </div>
                </React.Fragment>
    ))
}

const renderImageCover = (selected, item) => {
    if (selected?.id !== item.id) return null

    return (
        <img src={imageCover} alt="selectedItem" 
            style={{ position: "absolute", bottom: "0", right: "0" }}>
        </img>
    )

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