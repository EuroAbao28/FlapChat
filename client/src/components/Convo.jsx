import React, { useContext, useEffect, useState } from "react";
import "./Convo.css";
import { Context, toastOptions } from "../App";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import {
  getChatRoom,
  getMessages,
  getUserToChat,
  host,
  removeFriend,
  sendMessage,
} from "../utils/APIRoutes";
import axios from "axios";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import Spinner from "./Spinner";
import io from "socket.io-client";
import { toast } from "react-toastify";

function Convo() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [toggleOptions, setToggleOptions] = useState(false);
  const { currentUser, setCurrentUser, currentChat, setCurrentChat, socket } =
    useContext(Context);
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");

  const getCurrentChat = async (chatID) => {
    try {
      const response = await axios.get(`${getUserToChat}/${chatID}`);
      setCurrentChat(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMessage = async () => {
    try {
      const response = await axios.post(getMessages, {
        sender: currentUser._id,
        receiver: currentChat._id,
      });
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRoom = async () => {
    try {
      const response = await axios.post(getChatRoom, {
        sender: currentUser._id,
        receiver: currentChat._id,
      });

      setRoomId(response.data.roomId);
      // console.log(response.data.message, response.data.roomId);

      // join a room in socket.io
      socket.current.emit("joinRoom", response.data.roomId);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMsg = async (messageInput) => {
    try {
      const response = await axios.post(sendMessage, {
        sender: currentUser._id,
        receiver: currentChat._id,
        text: messageInput,
      });

      setMessages((prev) => [...prev, response.data]);

      const msgPayload = {
        sender: currentUser._id,
        receiver: currentChat._id,
        text: messageInput,
        room: roomId,
        createdAt: response.data.createdAt,
      };

      // emit to socket.io
      socket.current.emit("sendMessage", msgPayload);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // PS. hiniwalay ko na sa isang useEffect kasi
    // nag eerror kapag nireload ko yung page
    // nagiging undefined yung socket.current.disconnect()

    // connect to socket.io
    socket.current = io(host);
    // console.log("Current chat: ", currentChat.username);

    // PS. nilagay ko dito kasi kapag nilagay ko sa const getMessage
    // nagduduplicate yung receiveMessage data galing sa socket.io

    // listen to the emit "receiveMessage"
    // from the backend
    // and add the receiveMssage data to the array state message
    socket.current.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, [currentChat]);

  useEffect(() => {
    if (!currentChat._id) {
      // get chatuser
      // then is useEffect will re-run
      // then it will proceed to else
      // since the currentChat is not empty
      getCurrentChat(id);
    } else {
      // if the currentChat is not empty
      // get messages and store it in state
      getMessage();

      // get chat room id base on
      // currentuser and chatuser id
      getRoom();

      // if the currecntChat changes
      // it will disconnect and connect it again
      // and join to other room
      return () => {
        socket.current.disconnect();
      };
    }
  }, [currentChat]);

  useEffect(() => {
    if (currentUser && currentChat && messages) {
      setIsLoading(false);
    }
  }, [id]);

  const handleRemoveFriend = async () => {
    try {
      const response = await axios.post(`${removeFriend}/${currentUser._id}`, {
        friendId: currentChat._id,
      });

      toast.success(response.data.message, toastOptions);

      // id galing sa usePrams
      setCurrentUser((prev) => ({
        ...prev,
        friends: prev.friends.filter((user) => user._id !== id),
      }));

      setToggleOptions(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

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
                  currentChat.avatarImage
                    ? `data:image/svg+xml;base64,${currentChat.avatarImage}`
                    : ""
                }
                alt="avatar"
              />

              <h2>{currentChat.username}</h2>
            </div>
            <div className="right">
              <BsThreeDotsVertical
                onClick={() => setToggleOptions(!toggleOptions)}
              />
              <div className={`options ${toggleOptions && "show"}`}>
                <p onClick={handleRemoveFriend}>Remove from contacts</p>
              </div>
            </div>
          </header>

          <Messages messages={messages} />
          <ChatInput messageInput={sendMsg} />
        </>
      )}
    </div>
  );
}

export default Convo;
