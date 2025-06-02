import {useEffect} from "react"
import styles from "./folder.module.css"

const keyTranslator = {
    height: "Chiều Cao",
    waist: "Eo",
    long: "Dài",
    weight: "Cân Nặng",
    shoulder: "Vai",
    chest: "Ngực",
    length: "Dài Áo",
};

export default function Size({inventory, section, selectedItem, isChoosen, 
                        itemSection, updateSize, sizeSelected, setSizeSelected, 
                        missingSize, isMissingSize, setMissingSize}) {

    const pickSize = (index) => {
        
        setSizeSelected((prev) => {

            if (prev === index) {

                return null

            } else {

                return index
                
            }
            
        })
    };

    useEffect(() => {

        sizeSelected === null ? updateSize(section, null) : updateSize(section, selectedItem.sizes[sizeSelected])

        if (isMissingSize) {

            const missingSizes = missingSize.filter(item => item !== section)

            setMissingSize(missingSizes)
        }
            
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sizeSelected])

    useEffect(() => setSizeSelected(null), [selectedItem, setSizeSelected]);

    const isOpen = selectedItem && isChoosen === itemSection

    if (!isOpen) return null

    const buttonStyle = (isMissingSize, sizeSelected, index) => {
        return {
            border: isMissingSize ? "1px solid red" : 
            sizeSelected === index ? "1px solid #331D1C" : "none",
        }
    };

    console.log(inventory.measurements[selectedItem.sizes[sizeSelected]])

    return (
        <div className={styles.sizeContainer}>
            <div className={styles.size}>
                <h4> Size </h4>
                <div className={styles.options}>
                    {selectedItem.sizes.map((size, index) => (
                        <div key={index} className={styles.option}
                            style={buttonStyle(isMissingSize, sizeSelected, index)}
                            onClick={() => pickSize(index)}>
                                <p>{size}</p>
                        </div>
                    ))}
                    {isMissingSize ? <div className={styles.warning}> *Bắt buộc chọn</div> : null}
                </div>
            </div>

            {sizeSelected !== null && sizeSelected !== undefined && 
                inventory.measurements[selectedItem.sizes[sizeSelected]] && (
                    <div style={{ display: "flex", gap: "1em" }}>
                        {Object.entries(inventory.measurements[selectedItem.sizes[sizeSelected]]).map(([key, value], index) => (
                        <div key={index} style={{display: "flex", flexDirection:"column", gap: "0.05em", textAlign: "center" }}>
                            <h4>{keyTranslator[key] || key}</h4>
                            <p
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    padding: "0 0.75rem",
                                }}
                            >
                            {value}
                            </p>
                        </div>
                        ))}
                    </div>
                )}
        </div>

    )
}
