import React from "react";
import "./Welcome.css";
import Icon from "../assets/welcome.gif";

function Welcome() {
  return (
    <div className="welcome-container">
      <img src={Icon} alt="logo" />
      <h1>
        Welcome, <span>Orue</span>
      </h1>
      <p>Select a friend to start chatting</p>
    </div>
  );
}

export default Welcome;
