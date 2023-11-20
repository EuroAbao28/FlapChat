import React, { useContext, useEffect, useState } from "react";
import "./SideNav.css";
import { LuSearch } from "react-icons/lu";
import logo from "../assets/Chatting.png";
import { Context, toastOptions } from "../App";
import axios from "axios";
import {
  getUserToChat,
  checkuser,
  searchUser,
  addFriend,
} from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import { MdPersonAddAlt1 } from "react-icons/md";
import { toast } from "react-toastify";

function SideNav() {
  const navigate = useNavigate();
  const { setCurrentChat, currentUser, setCurrentUser } = useContext(Context);

  const [selectedContact, setSelectedContact] = useState("");
  const [toggleOverlay, setToggleOverlay] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const selectChat = async (details) => {
    if (selectedContact === details._id) {
      setSelectedContact("");
    }

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
    const handleSearch = async () => {
      setSearchLoading(true);
      if (searchInput.length > 1) {
        try {
          const results = await axios.post(`${searchUser}/${currentUser._id}`, {
            searchInput,
          });
          setSearchResult(results.data);
          setSearchLoading(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        setSearchResult([]);
        setSearchLoading(false);
      }
    };

    handleSearch();
  }, [searchInput]);

  const handleAddFriend = async (userData) => {
    setSearchInput("");

    const newFriend = {
      _id: userData._id,
      username: userData.username,
      email: userData.email,
      avatarImage: userData.avatarImage,
      friends: userData.friend,
    };

    try {
      const response = await axios.post(`${addFriend}/${currentUser._id}`, {
        friendId: userData._id,
      });

      if (response.status !== 200) {
        console.log(response.data.message);
        return;
      }

      toast.success(response.data.message, toastOptions);

      setCurrentUser((prev) => ({
        ...prev,
        friends: [...prev.friends, newFriend],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sidenav-container">
      <div className="header">
        <div className="brand">
          <img src={logo} alt="logo" />
          <h1>FlapChat</h1>
        </div>
        <div className="profile" onClick={toggleProfileOverlay}>
          {currentUser.avatarImage && (
            <img
              src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
              alt="avatar"
            />
          )}
        </div>
      </div>
      <div className="search-container">
        <LuSearch />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          placeholder="Search a user"
        />
      </div>
      <div className="contacts-container">
        <div className="scroll-container">
          {!searchInput ? (
            // if the currentUser friends is empty, show message
            currentUser.friends && currentUser.friends.length === 0 ? (
              <div className="friendsEmpty">
                <h2>No contacts yet</h2>
                <p>Add a user to start a conversation</p>
              </div>
            ) : (
              // if currentUser friends is not empty, show friends list
              currentUser.friends?.map((user, index) => (
                <div
                  className={`card ${
                    selectedContact === user._id && "selected"
                  }`}
                  key={index}
                  onClick={() => selectChat(user)}>
                  <img
                    src={`data:image/svg+xml;base64,${user.avatarImage}`}
                    alt="avatar"
                  />
                  <div className="info">
                    <h2>{user.username}</h2>
                    <p>Hello po</p>
                  </div>
                </div>
              ))
            )
          ) : searchResult.length === 0 ? (
            // if the searchResult array is empty, show message
            <p className="searchMessage">No user found</p>
          ) : searchLoading ? (
            // if searchLoading is true, show message
            <p className="searchMessage">Searching...</p>
          ) : (
            // if searchLoading if false, show result
            searchResult.map((result, index) => (
              <div className={`card`} key={index}>
                <div className="left">
                  <img
                    src={`data:image/svg+xml;base64,${result.avatarImage}`}
                    alt="avatar"
                  />
                  <div className="info">
                    <h2>{result.username}</h2>
                  </div>
                </div>
                <div className="right">
                  <MdPersonAddAlt1 onClick={() => handleAddFriend(result)} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className={`profile-overlay ${toggleOverlay ? "show" : ""}`}>
        <h2> My Profile</h2>
        <section>
          <img
            src={
              currentUser.avatarImage
                ? `data:image/svg+xml;base64,${currentUser.avatarImage}`
                : ""
            }
            alt="avatar"
          />
          <p>{currentUser.username}</p>
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
