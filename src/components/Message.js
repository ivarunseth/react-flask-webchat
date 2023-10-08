import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import DOMPurify from 'dompurify';

const Message = ({message, users}) => {

    const { user } = useContext(UserContext);

    return (
        <div
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
                    ~ {users.find(user => user.id === message.user_id)?.nickname}
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
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.html) }}
                />
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
    )
};

export default Message;