import somi from "../../assets/inventory/somi1.png"
import aolen from "../../assets/inventory/aolen1.png"
import chanvay from "../../assets/inventory/cv1.png"
import quandai from "../../assets/inventory/quan1.png"
import gakuran from "../../assets/inventory/gakuran1.png"
import blazer from "../../assets/inventory/blazer1.png"
import bow1 from "../../assets/inventory/bow1.png"
import bow2 from "../../assets/inventory/bow2.png"
import bow3 from "../../assets/inventory/bow3.png"
import cavat1 from "../../assets/inventory/cavat1.png"
import cavat2 from "../../assets/inventory/cavat2.png"
import cavat3 from "../../assets/inventory/cavat3.png"
import cavat4 from "../../assets/inventory/cavat4.png"
import bag1 from "../../assets/inventory/tui1.png"
import bag2 from "../../assets/inventory/tui2.png"
import bag3 from "../../assets/inventory/tui3.png"
import bag4 from "../../assets/inventory/tui4.png"

import somidemo from "../../assets/demo/somi1.png"
import blazerdemo from "../../assets/demo/blazer1.png"
import aolendemo from "../../assets/demo/aolen1.png"
import chanvaydemo from "../../assets/demo/cv1.png"
import quandaidemo from "../../assets/demo/quan1.png"
import gakurandemo from "../../assets/demo/gakuran1.png"
import bow1demo from "../../assets/demo/bow1.png"
import bow2demo from "../../assets/demo/bow2.png"
import bow3demo from "../../assets/demo/bow3.png"
import cavat1demo from "../../assets/demo/cavat1.png"
import cavat2demo from "../../assets/demo/cavat2.png"
import cavat3demo from "../../assets/demo/cavat3.png"
import cavat4demo from "../../assets/demo/cavat4.png"
import bag1demo from "../../assets/demo/tui1.png"
import bag2demo from "../../assets/demo/tui2.png"
import bag3demo from "../../assets/demo/tui3.png"
import bag4demo from "../../assets/demo/tui4.png"

// import fullset from "../../assets/demo/fullset.png"

import { useState } from "react"
import styles from "./Body.module.css"

import Item from "../Item/Item.jsx"
import Extra from "../Item/Extra.jsx"
import Demo from "./Demo.jsx"
import CheckOut from "./Checkout.jsx"

const inventory = {
    top : {
        type: "top",
        name: "Áo sơ mi",
        zIndex: 2,
        inventory: [
            {
                id: Math.random(),
                image: somi,
                demoImage: somidemo,
                amount: 10,
                size: ["S", "M", "L", "XL"],
                total: 50000
            },
            {
                id: Math.random(),
                image: somi,
                demoImage: somidemo,
                amount: 10,
                size: ["S", "M", "L", "XL"],
                total: 40000
            },
            {
                id: Math.random(),
                image: somi,
                demoImage: somidemo,
                amount: 10,
                size: ["S", "M", "L", "XL"],
                total: 30000
            },
            {
                id: Math.random(),
                image: somi,
                demoImage: somidemo,
                amount: 10,
                size: ["S", "M", "L", "XL"],
                total: 20000
            },
        ]
    },

    bottom_short : {
        type: "bottom",
        name: "Chân váy",
        zIndex: 3,
        inventory: [
            {
                id: Math.random(),
                section: "short",
                image: chanvay,
                demoImage: chanvaydemo,
                amount: 10,
                size: ["S", "M", "L", "XL"],
                total: 50000,
            },
        ]
    },

    bottom_long : {
        type: "bottom",
        name: "Quần",
        zIndex: 1,
        inventory: [
            {
                id: Math.random(),
                section: "long",
                image: quandai,
                demoImage: quandaidemo,
                amount: 10,
                size: ["S", "M", "L", "XL"],
                total: 50000,
            },
        ]
    },

    sweater : {
        type: "sweater",
        name: "Áo len",
        zIndex: 4,
        inventory : [
            {
                id: Math.random(),
                image: aolen,
                demoImage: aolendemo,
                amount: 10,
                size: ["S", "M", "L", "XL"],
                total: 50000,
            },
        ]
    },

    gakuran : {
        type: "jacket",
        name: "Gakuran",
        zIndex: 5,
        inventory : [
            {
                id: Math.random(),
                image: gakuran,
                demoImage: gakurandemo,
                section: "gakuran",
                amount: 10,
                size: ["S", "M", "L", "XL"],
                total: 50000,
            },
        ]
    },

    blazer : {
        type: "jacket",
        name: "Blazer",
        zIndex: 5,
        inventory: [
            {
                id: Math.random(),
                image: blazer,
                demoImage: blazerdemo,
                section: "blazer",
                amount: 10,
                size: ["S", "M", "L", "XL"],
                total: 50000,
            },
        ]
    },

    extra : {
        type: "extra",
        name: "Phụ kiện",
        zIndex: 6,
        inventoryA : [
            {
                id: Math.random(),
                image: bow1,
                demoImage: bow1demo,
                amount: 10,
                total: 25000,
            },
            {
                id: Math.random(),
                image: bow2,
                demoImage: bow2demo,
                amount: 10,
                total: 25000,
            },
            {
                id: Math.random(),
                image: bow3,
                demoImage: bow3demo,
                amount: 10,
                total: 25000,
            },
            {
                id: Math.random(),
                image: cavat1,
                demoImage: cavat1demo,
                amount: 10,
                total: 25000,
            },
            {
                id: Math.random(),
                image: cavat2,
                demoImage: cavat2demo,
                amount: 10,
                total: 25000,
            },
            {
                id: Math.random(),
                image: cavat3,
                demoImage: cavat3demo,
                amount: 10,
                total: 25000,
            },
            {
                id: Math.random(),
                image: cavat4,
                demoImage: cavat4demo,
                amount: 10,
                total: 25000,
            },
        ],
        inventoryB : [
            {
                id: Math.random(),
                image: bag1,
                demoImage: bag1demo,
                amount: 10,
                total: 25000,
            },
            {
                id: Math.random(),
                image: bag2,
                demoImage: bag2demo,
                amount: 10,
                total: 25000,
            },
            {
                id: Math.random(),
                image: bag3,
                demoImage: bag3demo,
                amount: 10,
                total: 25000,
            },
            {
                id: Math.random(),
                image: bag4,
                demoImage: bag4demo,
                amount: 10,
                total: 25000,
            },
        ]
    }
}

export default function Body() {

    const [bottomSelected, setBottomSelected] = useState(null)
    const [jacketSelected, setJacketSelected] = useState(null)
    const [missingSize, setMissingSize] = useState(null)
    const [resetTrigger, setResetTrigger] = useState(false)
    const [outFit, setOutFit] = useState({
        top: {
            item: null,
            size: null
        },
        bottom: {
            item: null,
            size: null
        },
        sweater: {
            item: null,
            size: null
        },
        jacket: {
            item: null,
            size: null
        },
        bow: {
            item: null,
        },
        bag: {
            item: null
        },
        total: 0
    })

    const UpdateOutFit = (item, category, zIndex) => {

        setOutFit((preOutFit) => {

            if (category === "extra") {

                const currentItem = preOutFit[category].item || []

                const existingIndex = currentItem.findIndex(extraItem => extraItem.id === item.id);

                if (existingIndex !== -1) {
                    const updatedItems = currentItem.filter((_, index) => index !== existingIndex);

                    console.log('hello')

                    return {
                        ...preOutFit,
                        [category]: { item: updatedItems },
                        total: preOutFit.total - currentItem[existingIndex].total,
                    };
                }

                const data = {
                    id : item.id,
                    image : item.image,
                    demoImage: item.demoImage,
                    zIndex: zIndex,
                    total: item.total
                }

                return {
                    ...preOutFit,
                    [category]: { item: [...currentItem, data] }, // Append item
                    total: preOutFit.total + item.total,
                };
            }

            const currentItem = preOutFit[category].item

            if (currentItem?.id === item.id) {
                if (category === "bottom") setBottomSelected(null);
                if (category === "jacket") setJacketSelected(null);

                return {
                    ...preOutFit,
                    [category]: category === "bag" || category === "bow" ? { item: null } : { item: null, size: null },
                    total: preOutFit.total - currentItem.total,
                };
            }

            if (category === "bottom") setBottomSelected(item.section);
            if (category === "jacket") setJacketSelected(item.section);

            const data = {
                id : item.id,
                image : item.image,
                demoImage: item.demoImage,
                zIndex: zIndex,
                total: item.total
            }

            return {
                ...preOutFit,
                [category]: category === "bag" || category === "bow" ? { item: data } : { item: data, size: null },
                total: preOutFit.total - (currentItem?.total || 0) + item.total,
            };
        })
    }

    const UpdateSize = (category, size) => {

        setOutFit((preOutFit) => {

            if (size === null) {

                return {
                    ...preOutFit,
                    [category]: { item: preOutFit[category].item, size: null },
                };
                

            } else {

                return {
                    ...preOutFit,
                    [category]: { item: preOutFit[category].item, size: size },
                };
                
            }

        }) 

    }

    const resetDefault = () => {

        setOutFit({
            top: { item: null, size: null },
            bottom: { item: null, size: null },
            sweater: { item: null, size: null },
            jacket: { item: null, size: null },
            bow: { item: null },
            bag: { item: null },
            total: 0
        });
    
        setBottomSelected(null);
        setJacketSelected(null);
        setMissingSize(null);
    
        return setResetTrigger(prev => !prev); 
    }

    return (
        <div className={styles.body}>
            <Demo 
                outFit={outFit} 
            />
            <div className={styles.primary}>
                <Item props={inventory.top} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Item props={inventory.bottom_short} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setBottomSelected} isChoosen={bottomSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Item props={inventory.bottom_long} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setBottomSelected} isChoosen={bottomSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Item props={inventory.sweater} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
            </div>
            <div className={styles.secondary}>
                <Item props={inventory.gakuran} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setJacketSelected} isChoosen={jacketSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger} />
                <Item props={inventory.blazer} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setJacketSelected} isChoosen={jacketSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Extra props={inventory.extra} UpdateOutFit={UpdateOutFit} resetTrigger={resetTrigger}/> 
                <CheckOut 
                    setMissingSize={setMissingSize}
                    outFit={outFit}
                    resetDefault={resetDefault}
                />
            </div> 
        </div>
    )
}