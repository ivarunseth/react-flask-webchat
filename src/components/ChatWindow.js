import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { Send } from "react-bootstrap-icons";
import { UserContext } from "../contexts/UserContext";
import { useSocket } from "../contexts/SocketContext"
import axios from "axios";

const ChatWindow = () => {

    const navigate = useNavigate();

    const { user } = useContext(UserContext);
    const socket = useSocket();
    
    const [onlineUsers, setOnlineUsers] = useState([]);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSendDisabled, setIsSendDisabled] = useState(false);
    
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Check if the user is not authenticated and navigate to the login page
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const getOnlineUsers = async () => {
            if (user) {
                try {
                    const response = await axios.get(
                        '/api/users?online=1',
                        {
                            headers: {
                                "Authorization": `Bearer ${user.token}`
                            }
                        }
                    );
                    setOnlineUsers(response.data.users);
                } catch (error) {
                    console.error("Error fetching online users:", error);
                }
            }
        };
        getOnlineUsers();
    }, [user]);
    
    useEffect(() => {
        // Fetch messages from the backend API when the component mounts
        const getMessages = async () => {
            if (user) {
                try {
                    const response = await axios.get(
                        '/api/messages',
                        {
                            headers: {
                                "Authorization": `Bearer ${user.token}`
                            }
                        }
                    );
                    setMessages(response.data.messages);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            }
        };
        getMessages();
    }, [user]);

    useEffect(() => {
        // Subscribe to 'updated_model' event to receive new messages from the server
        if (user && socket) {
            socket.on('updated_model', (data) => {
                if (data.class === 'Message') {
                    // Handle new message received from the server
                    setMessages(prevMessages => [...prevMessages, data.model]);
                } else if (data.class === 'User') {
                    // Handle user update received from the server
                    setOnlineUsers(prevUsers => {
                        // Check if the updated user is already in the online users list
                        const userIndex = prevUsers.findIndex(user => user.id === data.model.id);

                        if (userIndex !== -1) {
                            // If user is found, update the user in the list
                            const updatedUsers = [...prevUsers];
                            updatedUsers[userIndex] = data.model;
                            return updatedUsers;
                        } else {
                            // If user is not found, append the updated user to the list
                            return [...prevUsers, data.model];
                        }
                    });
                }
            });

            return () => {
                if (socket) {
                    socket.off('updated_model');
                }
            };
        }
    }, [user, socket]);

    useEffect(() => {
        // Scroll to the bottom of the chat window whenever messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [messages]);

    useEffect(() => {
        setIsSendDisabled(newMessage.trim().length === 0);
    }, [newMessage])

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() !== "" && socket && socket.connected) {
            socket.emit('post_message', { source: newMessage }, user.token);
            setNewMessage("")
        }
    };

    return (
        <Container className="mt-5">
            <style>
                {`
                        .scroll-container::-webkit-scrollbar {
                            width: 0.0em; /* Set the width of the invisible scrollbar */
                        }

                        .scroll-container::-webkit-scrollbar-thumb {
                            background-color: transparent; /* Set the thumb color to be transparent */
                        }
                    `}
            </style>
            <Row>
                <Col md={8} className="mx-auto">
                    <div
                        className="scroll-container"
                        style={{
                            maxHeight: 'calc(100vh - 9rem)',
                            overflowY: 'auto',

                        }}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                style={{
                                    marginBottom: "1rem",
                                }}
                            >
                                {message.user_id !== user.id && (
                                    <div style={{
                                        color: "#6c757d", // Muted text color (Bootstrap's text-muted color)
                                        fontStyle: "italic",
                                        fontSize: "0.8rem"
                                    }}>
                                        ~ {onlineUsers.find(user => user.id === message.user_id)?.nickname}
                                    </div>
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: message.user_id === user.id ? "flex-end" : "flex-start",
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: message.user_id === user.id ? "#007bff" : "#e5e5ea",
                                            color: message.user_id === user.id ? "white" : "black",
                                            borderRadius: message.user_id === user.id ? "1.2rem 1.2rem 0 1.2rem" : "1.2rem 1.2rem 1.2rem 0",
                                            padding: "0.6rem 0.9rem",
                                            wordWrap: "break-word",
                                            width: "fit-content",
                                            maxWidth: "69%", // Set a maximum width for the message bubbles
                                            display: "block",
                                        }}
                                    >
                                        {message.html}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: message.user_id === user.id ? "flex-end" : "flex-start",
                                    }}
                                >
                                    <div
                                        style={{
                                            color: "#6c757d", // Muted text color (Bootstrap's text-muted color)
                                            fontSize: "0.7rem",
                                        }}
                                    >
                                        {new Date(message.updated_at * 1000).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div ref={messagesEndRef} />
                    </div>
                    <div
                        style={{
                            position: "sticky",
                            bottom: 0,
                            padding: "0.6rem",
                            maxHeight: "9rem",
                            borderTop: "0.06rem solid #ccc",
                        }}
                    >
                        <Form className="mt-3">
                            <InputGroup>
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        overflowX: 'hidden',
                                    }}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                ></Form.Control>
                                <Button
                                    variant="light"
                                    onClick={handleSendMessage}
                                    style={{
                                        border: '1px solid #ccc',
                                    }}
                                    disabled={isSendDisabled}
                                >
                                    <Send style={{
                                        color: '#6c757d'
                                    }}
                                    />
                                </Button>
                            </InputGroup>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ChatWindow;
