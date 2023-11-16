import React, { useContext, useEffect, useState } from "react";
import "./SideNav.css";
import { LuSearch } from "react-icons/lu";
import logo from "../assets/Chatting.png";
import { Context } from "../App";
import axios from "axios";
import { getUserToChat, checkuser } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";

function SideNav({ contacts }) {
  const navigate = useNavigate();
  const { setCurrentChat } = useContext(Context);

  const [selectedContact, setSelectedContact] = useState("");
  const [toggleOverlay, setToggleOverlay] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [confirm, setConfirm] = useState(false);

  const selectChat = async (details) => {
    setSelectedContact(details._id);

    try {
      const response = await axios.get(`${getUserToChat}/${details._id}`);
      if (response) {
        setCurrentChat(response.data);
        navigate(`/${response.data._id}`);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleProfileOverlay = () => {
    setToggleOverlay(!toggleOverlay);
    setConfirm(false);
  };

  const handleLogout = () => {
    if (!confirm) {
      setConfirm(true);
    } else {
      localStorage.removeItem("user_token");
      navigate("/login");
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");

    const getUser = async () => {
      if (userToken) {
        try {
          const response = await axios.post(checkuser, { userToken });

          setLoggedInUser(response.data.userDetails);
        } catch (error) {
          console.log(error);
        }
      } else {
        navigate("/login");
      }
    };

    getUser();
  }, []);

  return (
    <div className="sidenav-container">
      <div className="header">
        <div className="brand">
          <img src={logo} alt="logo" />
          <h1>FlapChat</h1>
        </div>
        <div className="profile" onClick={toggleProfileOverlay}>
          {loggedInUser.avatarImage && (
            <img
              src={`data:image/svg+xml;base64,${loggedInUser.avatarImage}`}
              alt="avatar"
            />
          )}
        </div>
      </div>
      <div className="search-container">
        <form>
          <LuSearch />
          <input type="text" placeholder="Search a user" />
        </form>
      </div>
      <div className="contacts-container">
        <div className="scroll-container">
          {contacts.map((contact, index) => (
            <div
              className={`card ${
                selectedContact === contact._id && "selected"
              }`}
              key={index}
              onClick={() => selectChat(contact)}>
              <img
                src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                alt="avatar"
              />
              <div className="info">
                <h2>{contact.username}</h2>
                <p>Hello po</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`profile-overlay ${toggleOverlay ? "show" : ""}`}>
        <h2> My Profile</h2>
        <section>
          <img
            src={
              loggedInUser.avatarImage
                ? `data:image/svg+xml;base64,${loggedInUser.avatarImage}`
                : ""
            }
            alt="avatar"
          />
          <p>{loggedInUser.username}</p>
        </section>
        <section onClick={handleLogout} className={confirm ? "red" : ""}>
          <RiLogoutCircleLine />
          <p>{confirm ? "Are you sure?" : "Logout"}</p>
        </section>
      </div>
    </div>
  );
}

export default SideNav;
