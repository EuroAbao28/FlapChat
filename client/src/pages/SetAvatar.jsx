import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Buffer } from "buffer";
import "./SetAvatar.css";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { checkuser, setAvatar } from "../utils/APIRoutes";
import { Context, toastOptions } from "../App";
import { useNavigate } from "react-router-dom";

function SetAvatar() {
  const { currentUser } = useContext(Context);
  const navigate = useNavigate();
  const apiAvatar = "https://api.multiavatar.com/45678945";

  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const setProfilePicture = async () => {
    if (selectedAvatar === null)
      return toast.error("Please select an avatar", toastOptions);

    try {
      const response = await axios.post(`${setAvatar}/${currentUser._id}`, {
        image: avatars[selectedAvatar],
      });

      toast.success(response.data.message, toastOptions);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const setAvatarIndex = (index) => {
    setSelectedAvatar(index);
  };

  useEffect(() => {
    if (
      Object.keys(currentUser).length === 0 &&
      currentUser.avatarImage !== ""
    ) {
      navigate("/");
      return;
    }

    const getAvatars = async () => {
      const data = [];

      for (let i = 0; i < 3; i++) {
        const image = await axios.get(
          `${apiAvatar}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }

      setAvatars(data);
      setIsLoading(false);
    };

    getAvatars();
  }, []);

  return (
    <div className="setAvatar-container">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="content-wrapper">
          <h1>Choose your avatar</h1>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={selectedAvatar === index ? "selected-avatar" : ""}>
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  onClick={() => setAvatarIndex(index)}
                />
              </div>
            ))}
          </div>
          <div className="btn-container">
            <button onClick={setProfilePicture}>Select avatar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SetAvatar;
