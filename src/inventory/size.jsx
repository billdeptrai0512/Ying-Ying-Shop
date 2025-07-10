import { useEffect } from "react";
import styles from "./folder.module.css";

// ==================== Component ====================
export default function Size({
  inventory,
  section,
  selectedItem,
  isChoosen,
  itemSection,
  updateSize,
  sizeSelected,
  setSizeSelected,
  missingSize,
  isMissingSize,
  setMissingSize
}) {
  const isOpen =
    selectedItem &&
    isChoosen === itemSection &&
    selectedItem.type === inventory.files[0].type;

  useEffect(() => {
    if (!selectedItem || !inventory.files.length) return;

    const sameCategory = selectedItem.type === inventory.files[0].type;
    if (!sameCategory) return;

    const selectedSize = sizeSelected !== null && selectedItem.sizes?.[sizeSelected];
    updateSize(section, selectedSize || null);

    if (isMissingSize && !selectedSize) {
      const updatedMissing = missingSize.filter(item => item !== section);
      setMissingSize(updatedMissing);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeSelected]);

  useEffect(() => {
    setSizeSelected(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  const handlePickSize = (index) => {
    const isSameSize = sizeSelected === index;
    const newIndex = isSameSize ? null : index;
  
    setSizeSelected(newIndex);
    trackSizeSelection();
  
    const sizeExists = selectedItem?.sizes?.[newIndex] != null;
  
    if (sizeExists) {
      // Remove from missingSize immediately
      setMissingSize((prev) => prev?.filter(item => item !== section));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.sizeContainer}>
      <div className={styles.size}>
        <h4>Size</h4>
        <div className={styles.options}>
          {selectedItem.sizes.map((size, index) => (
            <div
              key={index}
              className={styles.option}
              style={getButtonStyle(isMissingSize, sizeSelected, index)}
              onClick={() => handlePickSize(index)}
            >
              <p>{size}</p>
            </div>
          ))}
          {isMissingSize && (
            <div className={styles.warning}>*Bắt buộc chọn</div>
          )}
        </div>
      </div>

      {renderSizeMeasurement(sizeSelected, inventory, selectedItem)}
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
