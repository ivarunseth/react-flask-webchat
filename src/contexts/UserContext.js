import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Update user context when storedUser changes (e.g., user logs in)
    useEffect(() => {
        if (!user) {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) {
                setUser(storedUser);
                navigate('/chat')
            }
        }
    }, [user, navigate]);

    // Handle logout logic
    const logout = () => {
        if (user) {
            axios.delete('/api/tokens', {headers: { "Authorization" : `Bearer ${user.token}` } }
            ).then(response => {
                if (response.status === 204) {
                    localStorage.removeItem("user");
                    setUser(null);
                    navigate("/");
                }
            }).catch(error => {
                console.error('Error on logout', error)
            });
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};