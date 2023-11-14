import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { checkuser, getAllUsers } from "../utils/APIRoutes";
import { Outlet, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Context } from "../App";
import "./Home.css";
import SideNav from "../components/SideNav";
import "../components/Spinner.css";

function Home() {
  const { setCurrentUser } = useContext(Context);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const isUserValid = async () => {
      const userToken = localStorage.getItem("user_token");
      setIsLoading(true);

      if (userToken) {
        try {
          const response = await axios.post(checkuser, { userToken });
          if (response.data.userDetails.isAvatarImageSet == false) {
            navigate("/setAvatar");
            setCurrentUser(response.data.userDetails);
            return;
          }

          try {
            const contacts = await axios.get(
              `${getAllUsers}/${response.data.userDetails._id}`
            );
            setContacts(contacts.data);

            setIsLoading(false);
            setCurrentUser(response.data.userDetails);
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
          setIsLoading(false);
          navigate("/login");
        }
      } else {
        setIsLoading(false);
        navigate("/login");
      }
    };

    isUserValid();
  }, []);

  return (
    <>
      <div className="home-container">
        {isLoading ? (
          <div className="spinner-home">
            <div className="spinner">
              <div className="dot1"></div>
              <div className="dot2"></div>
            </div>
          </div>
        ) : (
          <>
            <SideNav contacts={contacts} />
            <Outlet />
          </>
        )}
      </div>
    </>
  );
}

export default Home;
