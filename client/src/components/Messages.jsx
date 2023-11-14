import React, { useContext, useEffect, useRef, useState } from "react";
import "./Messages.css";
import { Context } from "../App";

function Messages({ messages }) {
  const { currentUser } = useContext(Context);
  const [toggleDate, setToggleDate] = useState(null);
  const scrollRef = useRef();

  const handleToggleDate = (index) => {
    if (toggleDate == index) {
      setToggleDate(null);
    } else {
      setToggleDate(index);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-container">
      <div className="message-scroll">
        {messages &&
          messages.map((msg, index) => (
            <div
              ref={scrollRef}
              onClick={() => handleToggleDate(index)}
              className={`text-container ${
                msg.sender === currentUser._id ? "sent" : "replied"
              }`}
              key={index}>
              <div className="text">
                <div className="body-container">
                  <p>{msg.text}</p>
                </div>
                <span className={`date ${toggleDate === index ? "show" : ""}`}>
                  Monday 4, 2023
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Messages;
