import React from "react";
import { ListGroup, FormControl } from "react-bootstrap";

const Sidebar = ({ onlineUsers, handleSearchChange }) => {
  return (
    <div className="sidebar">
      <FormControl
        type="text"
        placeholder="Search users..."
        className="mb-3"
        onChange={handleSearchChange}
      />
      <ListGroup>
        {onlineUsers.map((user) => (
          <ListGroup.Item key={user.id}>{user.name}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
