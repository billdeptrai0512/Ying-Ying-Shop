import axios from "axios";

// Attach the admin JWT (set by login) to every request so the backend's
// verifyToken middleware accepts admin calls. Public endpoints simply ignore it.
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// If the token is missing/expired, drop it and bounce to login so the admin
// re-authenticates instead of silently hitting 401s.
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && localStorage.getItem("token")) {
            localStorage.removeItem("token");
            if (!window.location.pathname.startsWith("/login")) {
                window.location.assign("/login");
            }
        }
        return Promise.reject(error);
    }
);
