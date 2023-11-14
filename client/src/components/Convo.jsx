import React, { useContext, useEffect, useState } from "react";
import "./Convo.css";
import { Context } from "../App";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkuser,
  getMessages,
  getUserToChat,
  host,
  sendMessage,
} from "../utils/APIRoutes";
import axios from "axios";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import Spinner from "./Spinner";
import io from "socket.io-client";

function Convo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, socket } = useContext(Context);

  const [userToChat, setUserToChat] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const dummy = "dummy";

  useEffect(() => {
    socket.current = io(host);
    socket.current.on("getMessage", (data) => {
      console.log("getMessage: ", data);
      setMessages((prev) => [...prev, data]);
      console.log("getMessage");
    });
  }, [id]);

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);
  }, [currentUser]);

  const sendMsg = async (msg) => {
    try {
      const response = await axios.post(sendMessage, {
        text: msg,
        sender: currentUser._id,
        receiver: userToChat._id,
      });

      const messageData = {
        senderId: currentUser._id,
        receiverId: userToChat._id,
        text: msg,
      };

      // socket.io
      socket.current.emit("sendMessage", messageData);

      setMessages((prev) => [...prev, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const getUserAndMessage = async () => {
      try {
        const chatUser = await axios.get(`${getUserToChat}/${id}`);

        if (chatUser.status == 200) {
          setUserToChat(chatUser.data);
          console.log("UserToChat: ", chatUser.data._id);

          // get/check user
          try {
            const userToken = localStorage.getItem("user_token");

            const user = await axios.post(checkuser, { userToken });

            if (user) {
              // get messages
              try {
                const convoMessages = await axios.post(getMessages, {
                  sender: user.data.userDetails._id,
                  receiver: chatUser.data._id,
                });

                if (convoMessages) {
                  setMessages(convoMessages.data);
                  setIsLoading(false);
                }
              } catch (error) {
                console.log(error);
              }
            }
          } catch (error) {
            console.log(error);
          }
        }

        if (chatUser.status == 400) {
          return console.log(chatUser.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserAndMessage();
  }, [id]);

  return (
    <div className="convo-container">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <header>
            <div className="left">
              <IoMdArrowRoundBack
                className="back"
                onClick={() => navigate("/")}
              />
              <img
                src={
                  userToChat.avatarImage
                    ? `data:image/svg+xml;base64,${userToChat.avatarImage}`
                    : ""
                }
                alt="avatar"
              />

              <h2>{userToChat.username}</h2>
            </div>
            <div className="right">
              <BsThreeDotsVertical className="menu" />
            </div>
          </header>

          <Messages messages={messages} />
          <ChatInput message={sendMsg} />
        </>
      )}
    </div>
  );
}

export default Convo;
