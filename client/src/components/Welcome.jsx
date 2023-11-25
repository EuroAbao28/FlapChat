import React, { useContext } from "react";
import "./Welcome.css";
import { Context } from "../App";

function Welcome() {
  const { currentUser } = useContext(Context);
  return (
    <div className="welcome-container">
      <h1>
        Welcome, <span>{currentUser.username}</span>
      </h1>
      <p>Select a friend to start a conversation.</p>
    </div>
  );
}

export default Welcome;
