import React, { useState } from "react";
import "./ChatInput.css";
import { BsEmojiSmileFill } from "react-icons/bs";
import { BiSolidSend } from "react-icons/bi";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

function ChatInput({ message }) {
  const [msg, setMsg] = useState("");
  const [toggleEmoji, setToggleEmoji] = useState(false);

  const passMessage = async (e) => {
    e.preventDefault();

    if (!msg) {
      return console.log("empty");
    }

    message(msg);
    setMsg("");
    setToggleEmoji(false);
  };

  const handleEmoji = (emoji) => {
    setMsg((prevMsg) => prevMsg + emoji.emoji);
  };

  const handleToggleEmoji = () => {
    setToggleEmoji(!toggleEmoji);
  };

  return (
    <div className="chatInput-container">
      {toggleEmoji && <EmojiPicker onEmojiClick={handleEmoji} />}
      <div className="emoji-btn">
        <BsEmojiSmileFill onClick={handleToggleEmoji} />
      </div>
      <form onSubmit={(e) => passMessage(e)}>
        <textarea
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Write a message..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              passMessage(e);
            }
          }}
        />
        <button type="submit">
          <BiSolidSend />
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
