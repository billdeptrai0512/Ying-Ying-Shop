import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./inventory.module.css"; // Assuming you have a CSS module

export default function SectionBoard({ setId, id }) {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/inventory/name`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const sortedCategories = sortCategoriesById(response.data);
            setCategories(sortedCategories);
        } catch (err) {
            handleFetchError(err);
        }
    };

    const sortCategoriesById = (categories) => {
        return categories.sort((a, b) => a.id - b.id);
    };

    const handleFetchError = (err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
    };

    const renderError = () => {
        return <div className={styles.error}>{error}</div>;
    };

    const renderCategories = () => {
        return categories.map((category) => (
            <div
                key={category.id} className={styles.section}
                onClick={() => setId(category.id)}
                style={id === category.id ? { backgroundColor: '#E3C4C1' } : {}}
            >
                {category.name}
            </div>
        ));
    };

    if (error) {
        return renderError();
    }

    return <div className={styles.sectionBoard}>{renderCategories()}</div>;
}
