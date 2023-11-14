import React from "react";
import "./Spinner.css";

function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="dot1"></div>
        <div className="dot2"></div>
      </div>
    </div>
  );
}

export default Spinner;
