import React, { useContext, useEffect, useRef, useState } from "react";
import "./Messages.css";
import { Context } from "../App";
import TimeAgo from "react-timeago";

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
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              ref={scrollRef}
              className={`text-container ${
                msg.sender === currentUser._id ? "sent" : "replied"
              }`}
              key={index}>
              <div className="text">
                <div className="body-container">
                  <p onClick={() => handleToggleDate(index)}>{msg.text}</p>
                </div>
                <span className={`date ${toggleDate === index ? "show" : ""}`}>
                  <TimeAgo date={msg.createdAt} />
                </span>
              </div>
            </div>
          ))
        ) : (
          <h1>Empty</h1>
        )}
      </div>
    </div>
  );
}

export default Messages;
