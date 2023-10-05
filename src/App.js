import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignUp from "./components/Signup";
import ChatWindow from "./components/ChatWindow";
import { UserProvider } from "./contexts/UserContext";
import { SocketProvider } from "./contexts/SocketContext";

const App = () => {
  return (
    <Router>
      <UserProvider>
        <SocketProvider>
          {/* SocketProvider should wrap the components using useSocket */}
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/chat" element={<ChatWindow />} />
          </Routes>
        </SocketProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
