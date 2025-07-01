import { useState, useEffect } from "react";
import styles from "./inventory.module.css";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ListItem({ selectItem, selectedItem, setExtraType, listItem, categoryId, updateDisplayID }) {
  const [items, setItems] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (Array.isArray(listItem)) {
      setItems([...listItem].sort((a, b) => a.displayID - b.displayID));
    }
  }, [listItem]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDragEnd = async (result) => {
    if (!result.destination || result.source.index === result.destination.index) return;

    const updatedItems = [...items];
    const [moved] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, moved);

    setItems(updatedItems);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/file/reorder`, {
        newOrder: updatedItems.map((item) => item.id),
      });

      updateDisplayID(updatedItems, categoryId);
    } catch (err) {
      console.error("Failed to reorder:", err);
    }
  };

  const renderLoading = () => (
    <p style={{ padding: "1em" }}>Đang tải dữ liệu...</p>
  );

  const renderExtraTypeSelector = () => (
    <select
      name="extra-type"
      className={styles.input}
      style={{ width: "100%", marginBottom: "1em" }}
      onChange={(e) => setExtraType(e.target.value)}
    >
      <option value="bow">Bow</option>
      <option value="tie">Tie</option>
      <option value="bag">Bag</option>
    </select>
  );

  const renderItem = (item, provided, snapshot) => (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={styles.cartItem}
      style={{
        ...provided.draggableProps.style,
        border: selectedItem?.id === item.id ? "5px solid #E3C4C1" : "1px solid #ccc",
        background: snapshot.isDragging ? "#f0f0f0" : "white",
      }}
      onClick={() => selectItem(item.id)}
    >
      <img
        src={item.image || "/path/to/default-image.jpg"}
        alt={`Item ${item.id}`}
        className={styles.itemImage}
      />
      <div>
        <p className={styles.itemSize}>{item.name}</p>
        <p className={styles.itemId}>Giá: {Number(item.total).toLocaleString()}đ</p>
        <p className={styles.itemId}>Số lượng: {item.amount}</p>
        <p className={styles.itemId}>
          Sizes: {Array.isArray(item.sizes)
            ? item.sizes.join(", ")
            : item.sizes?.match(/(S|M|L|XL|XXL|XS)/g)?.join(", ") || item.sizes}
        </p>
      </div>
    </li>
  );

  const renderItemList = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="itemList">
        {(provided) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={styles.cartList}
          >
            {items.map((item, index) => (
              <Draggable
                key={item.id.toString()}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided, snapshot) => renderItem(item, provided, snapshot)}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );

  if (!items || !items.length) {
    return renderLoading();
  }

  return (
    <>
      {categoryId === 8 && renderExtraTypeSelector()}
      {isMounted && renderItemList()}
    </>
  );
}