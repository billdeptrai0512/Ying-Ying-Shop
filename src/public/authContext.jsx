import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {

        const token = localStorage.getItem('token')

        if (!token) return

        try {

            const decoded = jwtDecode(token)
            setUser(decoded.user)

        } catch (err) {
            console.error('invald token: ' + err)
            localStorage.removeItem('token')
        }

    }, [])

    const login = (token) => {

        localStorage.setItem('token', token)
        const decoded = jwtDecode(token)
        setUser(decoded.user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
          {children}
        </AuthContext.Provider>
    );

}


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);