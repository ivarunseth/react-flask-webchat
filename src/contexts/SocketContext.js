import React, {
    createContext,
    useContext,
    useRef,
    useEffect,
} from 'react'

import io from 'socket.io-client'
import { UserContext } from './UserContext'

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
    
    const socket = useRef(null)

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    
    const { user } = useContext(UserContext);
    const socket = useContext(SocketContext);
    
    useEffect(() => {

        if (user && !socket.current) {
            socket.current = io('http://localhost:5000',{ transports: ['websocket']} );

            let pingInterval;

            socket.current.on('connect', () => {
                console.info(`Successfully connected to socket`);
                pingInterval = setInterval(() => {
                    socket.current.emit('ping_user', user.token);
                }, 30000);
            })

            let reconnectInterval;

            socket.current.on('disconnect', () => {
                console.info(`Successfully disconnected`)
                reconnectInterval = setInterval(() => {
                    socket.current.connect();
                }, 3000);
            })

            socket.current.on('error', error => {
                console.error('Socket Error:', error.message);
            })
            
            return () => {
                if (socket.current && socket.current.connected) {
                    clearInterval(pingInterval);
                    clearInterval(reconnectInterval);
                    socket.current.disconnect();
                }
            };
        }

    }, [user, socket])

    return socket.current;
};