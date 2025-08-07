import { X } from 'lucide-react';
import axios from 'axios';

export default function DeleteOrder({orderId, setRefresh}) {

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/order/delete/${orderId}`);

            setRefresh((prev => !prev))

        } catch (err) {

            console.error('Delete failed', err);

        }
    };

    return (
        <X onClick={handleSubmit} style={{cursor: "pointer"}}/>
    );
}