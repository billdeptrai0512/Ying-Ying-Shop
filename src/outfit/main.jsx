import { useState } from "react"
import styles from "./outfit.module.css"
import Demo from "./demo.jsx"
import CheckOut from "./checkout.jsx"
import Folder from "../folder/main.jsx"
import { useMediaQuery } from "react-responsive";
import { useFolder } from "../public/folderContext"

export default function Outfit() {

    const [bottomSection, setBottomSection] = useState(null)
    const [jacketSection, setJacketSection] = useState(null)
    const [neckSection, setNeckSection] = useState(null)
    const [missingSize, setMissingSize] = useState(null)
    const [resetTrigger, setResetTrigger] = useState(false)
    const [outFit, setOutFit] = useState({
        id: Math.random(),
        top: { item: null, size: null },
        bottom: { item: null, size: null },
        sweater: { item: null, size: null },
        jacket: { item: null, size: null },
        extra: { 
            neck: { item: null}, 
            bag: { item: null},
        },
        total: 0
    })

    const updateOutFit = (item, section) => {

        setOutFit((preOutFit) => {

            if (section === "extra") {

                if(item.type === "bow" || item.type === "tie") {

                    const currentItem = preOutFit[section]["neck"].item

                    setNeckSection(item.type);

                    if (currentItem?.id === item.id) {
    
                        return {
                            ...preOutFit,
                            [section]: {
                                ...preOutFit[section],
                                ["neck"] : {item : null}
                            }, 
                            total: preOutFit.total - currentItem.total,
                        };
    
                    }
    
                    return {
                        ...preOutFit,
                        [section]: {
                            ...preOutFit[section],
                            ["neck"] : {item : item} 
                        }, 
                        total: preOutFit.total - (currentItem?.total || 0) + item.total,
                    };



                } 

                const currentItem = preOutFit[section][item.type].item
            
                if (currentItem?.id === item.id) {
    
                    return {
                        ...preOutFit,
                        [section]: {
                            ...preOutFit[section],
                            [item.type] : {item : null}
                        }, 
                        total: preOutFit.total - currentItem.total,
                    };

                }

                return {
                    ...preOutFit,
                    [section]: {
                        ...preOutFit[section],
                        [item.type] : {item : item} 
                    }, 
                    total: preOutFit.total - (currentItem?.total || 0) + item.total,
                };
            }

            const currentItem = preOutFit[section].item

            //double click same item
            if (currentItem?.id === item.id) {
                if (section === "bottom") setBottomSection(null);
                if (section === "jacket") setJacketSection(null);

                return {
                    ...preOutFit,
                    [section]: { item: null, size: null },
                    total: preOutFit.total - currentItem.total,
                };
            }

            //select new item
            //disable bottom and jacket other type
            if (section === "bottom") setBottomSection(item.type);
            if (section === "jacket") setJacketSection(item.type);
            
            return {
                ...preOutFit,
                [section]: {item: item, size: null},
                total: preOutFit.total - (currentItem?.total || 0) + item.total,
                //total = tổng tiền trước đó - curentItem nếu có + item mới
            };
        })
    }

    const updateSize = (category, size) => {

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
            extra: { bow: {item: null}, bag: {item: null}},
            total: 0
        });
    
        setBottomSection(null);
        setJacketSection(null);
        setMissingSize(null);
    
        return setResetTrigger(prev => !prev); 
    }

    const { folder, loading } = useFolder()
    const isDesktop = useMediaQuery({ query: '(min-width: 1400px)'})
    
    if (isDesktop) {

        const leftFolder = folder.filter((inventory) => {
            return inventory.section === 'top' || inventory.section === 'bottom' || inventory.section === 'sweater'
        })
  
        const rightFolder = folder.filter((inventory) => {
          return inventory.section === 'jacket' || inventory.section === 'extra'
        })

        return (
            <>
                <section className={styles.main}>
                    <Demo outFit={outFit} styles={styles} />
                </section>
                <section className={styles.primary}>
                    <Folder  
                        folder={leftFolder}
                        loading={loading}
                        updateOutFit={updateOutFit} updateSize={updateSize} 
                        missingSize={missingSize} setMissingSize={setMissingSize} 
                        bottomSection={bottomSection} jacketSection={jacketSection}
                        resetTrigger={resetTrigger} />
                </section>
                <section className={styles.checkout}>
                    <Folder  
                        folder={rightFolder}
                        loading={loading}
                        updateOutFit={updateOutFit} updateSize={updateSize} 
                        missingSize={missingSize} setMissingSize={setMissingSize} 
                        bottomSection={bottomSection} jacketSection={jacketSection}
                        resetTrigger={resetTrigger} />
                    <CheckOut 
                        setMissingSize={setMissingSize}
                        outFit={outFit}
                        resetDefault={resetDefault}
                        styles={styles}/>
                </section> 
            </>
        )

    } 

    // Mobile view
    return (
        <>
            <section className={styles.main}>
                <Demo outFit={outFit} styles={styles} />
            </section>
            <section className={styles.primary}>
                <Folder  
                    folder={folder}
                    updateOutFit={updateOutFit} updateSize={updateSize} 
                    missingSize={missingSize} setMissingSize={setMissingSize} 
                    bottomSection={bottomSection} jacketSection={jacketSection}
                    neckWearSection={neckSection}
                    resetTrigger={resetTrigger} />
            </section>
            <section className={styles.checkout}>
                <CheckOut 
                    setMissingSize={setMissingSize}
                    outFit={outFit}
                    resetDefault={resetDefault}
                    styles={styles}/>
            </section> 
        </>
    )
}

