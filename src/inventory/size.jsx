import { useState, useEffect } from "react";
import { useOutfit } from "../public/outfitContext";
import imageCover from "./../assets/tickweb.png"
import styles from "./folder.module.css";

// ==================== Component ====================
export default function Size({inventory}) {

    const { outFit, updateSize, missingSizes } = useOutfit()
    const [selectedSize, setSelectedSize] = useState(null)

    const item = outFit[inventory.section].item

    const isMissingSize = missingSizes?.includes(inventory.section)

    useEffect(() => {

      setSelectedSize(null)

    }, [item])

    if (!item) return 

    const pickSize = (section, size) => {

      if (size === selectedSize) {

        updateSize(section, null)
        return setSelectedSize(null)

      }

      trackSizeSelection()

      updateSize(section, size)

      return setSelectedSize(size)
      
    } 

    if (!sameSection(outFit, inventory)) return

    const renderOptions = (item) => {

        const sizes = item.sizes

        return (
          <div className={styles.options}>
            {sizes.map((size, index) => (
              <div key={index} className={styles.option}
                style={getButtonStyle(isMissingSize, selectedSize, size)}
                onClick={() => pickSize(inventory.section, size)}
              >
                <p>{size}</p>
                {renderImageCover(selectedSize, size)}

              </div>
            ))}

            {isMissingSize && <div className={styles.warning}>*</div>}
          </div>
        )
    }

    return (
      <div className={styles.sizeContainer}>
        <div className={styles.size}>
          <h4>Size</h4>
          { renderOptions(item) }
        </div>

        {renderSizeMeasurement(selectedSize, inventory)}
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

function renderSizeMeasurement(sizeSelected, inventory) {

  if (sizeSelected == null) return null;

  const measurements = inventory.measurements[sizeSelected];

  if (!measurements) return null;

  return (
    <div style={{ display: "flex", gap: "0.5em", paddingTop:"2px"}}>
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
    backgroundColor:"#6E6E6E",
    color: "#FFFFFF",
    padding: "2px 1rem"
  };

  return (
    <div style={containerStyle}>
      <h4>{keyTranslator[label] || label}</h4>
      <p style={textStyle}>{value}</p>
    </div>
  );
}

function getButtonStyle(isMissingSize, selectedSize, size) {
  const isSelected = selectedSize === size;

  if (isSelected) return { border: "1px solid #331D1C" }; // ưu tiên nếu được chọn
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
