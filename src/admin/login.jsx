import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../public/authContext';
import styles from "./admin.module.css"


export default function Login() {

    const { login } = useAuth()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/log-in`, {
                username: formData.username,
                password: formData.password
            });

            const token = response.data.token

            login(token)

            navigate('/')
            
        } catch (err) {

            console.error('Login failed', err);

        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    id="username"
                    name="username"
                    placeholder="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">Log In</button>
            </form>
        </div>
            
    );
}