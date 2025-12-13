import { useState, useEffect, useMemo } from "react";
import styles from "./inventory.module.css";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ListItem({ id, selectedItem, setSelectedItem }) {

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [extraType, setExtraType] = useState("");

    useEffect(() => {

        setLoading(true);

        const fetchItems = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/inventory/${id}`, {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                });

                const sortedItems = response.data.files.sort((a, b) => a.displayID - b.displayID);

                setItems(sortedItems || []);

            } catch (err) {
                console.error("Failed to fetch items:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchItems();

    }, [id])

    const filteredItems = useMemo(() => {
        if (extraType !== "") {
            return items.filter(item => item.type === extraType);
        }
        return items;
    }, [items, extraType]);


    const selectItem = (itemId) => {

        const item = items.find(item => item.id === itemId);

        if (!item) return;

        const isNotThePreviousItem = selectedItem?.id !== item.id;

        setSelectedItem(isNotThePreviousItem ? item : null);

    };

    const handleDragEnd = async (result) => {
        if (!result.destination || result.source.index === result.destination.index) return;

        const updatedItems = [...items];
        const [moved] = updatedItems.splice(result.source.index, 1);
        updatedItems.splice(result.destination.index, 0, moved);

        try {

            setItems(updatedItems);

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/item/reorder`, {
                newOrder: updatedItems.map((item) => item.id),
            });

        } catch (err) {

            console.error("Failed to reorder:", err);

        }

    };

    const renderExtraTypeSelector = useMemo(() => (
        <select
            name="extra-type"
            className={styles.input}
            style={{ width: "100%", marginBottom: "1em" }}
            onChange={(e) => setExtraType(e.target.value)}
        >
            <option value="">Tất cả</option>
            <option value="bow">Bow</option>
            <option value="tie">Tie</option>
            <option value="bag">Bag</option>
        </select>
    ), []);

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

    const itemList = useMemo(() => {
        return id === 8 ? filteredItems : items;
    }, [items, filteredItems, id]);

    const renderItemList = () => {
        return (
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="itemList">
                    {(provided) => (
                        <ul
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={styles.cartList}
                        >
                            {itemList.map((item, index) => (
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

    };

    const renderLoading = () => (
        <p style={{ padding: "1em" }}>Đang tải dữ liệu...</p>
    );

    const renderButtonAddItem = () => (
        <div className={styles.action}>

            <button type="button" className={styles.saveButton}
                onClick={() => setIsCreating(true)}>
                Thêm Item
            </button>

        </div>
    )

    if (loading) {
        return renderLoading();
    }

    //extra type
    if (id === 8) {
        return (
            <>
                {renderExtraTypeSelector}
                {renderItemList()}
                {renderButtonAddItem()}
            </>
        );
    }

    return (
        <>
            {renderItemList()}
            {renderButtonAddItem()}
        </>
    )
}