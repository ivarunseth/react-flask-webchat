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

    // Handle login logic
    const login = async (username, password) => {
        if (!user) {
            await axios.post('/api/tokens',
                {},
                {
                    auth: {
                        username: username,
                        password: password
                    }
                }
            ).then(response => {
                setUser(response.data)
                localStorage.setItem("user", JSON.stringify(response.data));
                navigate("/chat");
            }).catch(error => {
                console.error('Error on login', error)
            });
        }
    }

    // Handle logout logic
    const logout = async () => {
        if (user) {
            await axios.delete('/api/tokens', {
                headers: { 
                    Authorization : `Bearer ${user.token}` 
                } 
            }).then(response => {
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
        <UserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};