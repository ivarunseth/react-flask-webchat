import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Chat from "./components/Chat";
import { UserProvider } from "./contexts/UserContext";
import { SocketProvider } from "./contexts/SocketContext";

const App = () => {
  return (
    <Router>
      <UserProvider>
        <SocketProvider>
          {/* SocketProvider should wrap the components using useSocket */}
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </SocketProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
