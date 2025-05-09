import { useState } from "react"
import styles from "./Body.module.css"
import Demo from "./demo.jsx"
import CheckOut from "./checkout.jsx"
import Item from "../folder/item.jsx"
import Extra from "../folder/extra.jsx"
import { Outlet } from "react-router-dom"

export default function Body() {

    const [bottomSelected, setBottomSelected] = useState(null)
    const [jacketSelected, setJacketSelected] = useState(null)
    const [missingSize, setMissingSize] = useState(null)
    const [resetTrigger, setResetTrigger] = useState(false)
    const [outFit, setOutFit] = useState({
        id: Math.random(),
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
            id: Math.random(),
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
            <section className={styles.main}>
                <Demo outFit={outFit} styles={styles} />
            </section>
            <section className={styles.primary}>
                {/* {folder.map((inventory, index) => (
                    <Item folderId={inventory.id} inventory={inventory} />
                ))} */}
                {/* <Item props={inventory.top} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Item props={inventory.bottom_short} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setBottomSelected} isChoosen={bottomSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Item props={inventory.bottom_long} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setBottomSelected} isChoosen={bottomSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Item props={inventory.sweater} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Item props={inventory.gakuran} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setJacketSelected} isChoosen={jacketSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger} />
                <Item props={inventory.blazer} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setJacketSelected} isChoosen={jacketSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Extra props={inventory.extra} UpdateOutFit={UpdateOutFit} resetTrigger={resetTrigger}/>  */}
                <Outlet />


            </section>
            {/* <section className={styles.checkout}>
                <CheckOut 
                    setMissingSize={setMissingSize}
                    outFit={outFit}
                    resetDefault={resetDefault}
                    styles={styles}/>
            </section>  */}
        </div>
    )
}

