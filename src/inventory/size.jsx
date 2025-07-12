import { useState, useEffect } from "react";
import { useOutfit } from "../public/outfitContext";
import imageCover from "./../assets/tickweb.png"
import styles from "./folder.module.css";

// ==================== Component ====================
export default function Size({inventory}) {

    const { outFit, updateSize } = useOutfit()
    const [selectedSize, setSelectedSize] = useState(null)

    const item = outFit[inventory.section].item

    useEffect(() => {

      setSelectedSize(null)

    }, [item])

    if (!item) return 

    const pickSize = (section, size) => {

      if (size === selectedSize) return setSelectedSize(null)

      updateSize(section, size)

      return setSelectedSize(size)
      
    } 

    // useEffect(() => {
    //   if (!selectedItem || !inventory.files.length) return;

    //   const sameCategory = selectedItem.type === inventory.files[0].type;
    //   if (!sameCategory) return;

    //   const selectedSize = sizeSelected !== null && selectedItem.sizes?.[sizeSelected];
    //   updateSize(section, selectedSize || null);

    //   if (isMissingSize && !selectedSize) {
    //     const updatedMissing = missingSize.filter(item => item !== section);
    //     setMissingSize(updatedMissing);
    //   }

    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [sizeSelected]);

    // useEffect(() => {
    //   updateSize(null);
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedItem]);

    // const handlePickSize = (index, size) => {
    //   console.log(size)
    //   const isSameSize = sizeSelected === index;
    //   const newIndex = isSameSize ? null : index;
    //   //we need section and the size they choose
    //   updateSize(newIndex);
    //   trackSizeSelection();
    
    //   const sizeExists = selectedItem?.sizes?.[newIndex] != null;
    
    //   if (sizeExists) {
    //     // Remove from missingSize immediately
    //     setMissingSize((prev) => prev?.filter(item => item !== section));
    //   }
    // };
  

    // if (!isOpen) return null;
    if (!sameSection(outFit, inventory)) return

    const renderOptions = (item) => {

        const sizes = item.sizes

        return (
          <div className={styles.options}>
            {sizes.map((size, index) => (
              <div key={index} className={styles.option}
                style={selectedSize === size ? { border: "1px solid #331D1C" } : { border: "none" }}
                onClick={() => pickSize(inventory.section, size)}
              >
                <p>{size}</p>
                {renderImageCover(selectedSize, size)}

              </div>
            ))}

            {/* {isMissingSize && <div className={styles.warning}>*Bắt buộc chọn</div>} */}
          </div>
        )
    }

    return (
      <div className={styles.sizeContainer}>
        <div className={styles.size}>
          <h4>Size</h4>
          { renderOptions(item) }
        </div>

        {/* {renderSizeMeasurement(selectedSize, inventory, item)} */}
      </div>
    );
}

// ==================== Helpers ====================

const keyTranslator = {
  height: "Chiều Cao",
  waist: "Eo",
  long: "Dài",
  weight: "Cân Nặng",
  shoulder: "Vai",
  chest: "Ngực",
  length: "Dài Áo"
};

function renderSizeMeasurement(sizeSelected, inventory, selectedItem) {
  if (sizeSelected == null) return null;

  const sizeKey = selectedItem.sizes?.[sizeSelected];
  const measurements = inventory.measurements[sizeKey];

  if (!measurements) return null;

  return (
    <div style={{ display: "flex", gap: "1em" }}>
      {Object.entries(measurements).map(([key, value], index) => (
        <SizeDetail key={index} label={key} value={value} />
      ))}
    </div>
  );
}

function SizeDetail({ label, value }) {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.05em",
    textAlign: "center"
  };

  const textStyle = {
    backgroundColor: "#FFFFFF",
    padding: "0 0.75rem"
  };

  return (
    <div style={containerStyle}>
      <h4>{keyTranslator[label] || label}</h4>
      <p style={textStyle}>{value}</p>
    </div>
  );
}

function getButtonStyle(isMissingSize, sizeSelected, index) {
    const isSelected = sizeSelected === index;
  
    if (isSelected) return { border: "1px solid #331D1C" }; // selected takes priority
    if (isMissingSize) return { border: "1px solid red" };
    return { border: "none" };
}

function trackSizeSelection() {
    let count = parseInt(sessionStorage.getItem("pickSize") || "0", 10);
    count++;
    sessionStorage.setItem("pickSize", count);

    return window.gtag("event", "click", {
        event_category: "Button",
        event_label: "select sizes",
        click_count: count
    });
}

const sameSection = (outFit, inventory) => {

  const firstIteminInventory = inventory.files[0]
  if (!firstIteminInventory) return 

  const item = outFit[inventory.section].item
  if (!item) return

  if (item.type !== firstIteminInventory.type) return false

  return true
}

const renderImageCover = (selected, size) => {
    if (selected !== size) return null

    return (
        <img src={imageCover} alt="selectedItem" 
            style={{ position: "absolute", bottom: "0", right: "0", width: "33%" }}>
        </img>
    )

}
