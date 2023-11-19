import React, { useState } from "react";
import "./Form.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Chatting.png";
import { toast } from "react-toastify";
import { registerRoute } from "../utils/APIRoutes";

function Register() {
  const navigate = useNavigate();
  const [isBtnDisable, setIsBtnDisable] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    className: "toast",
    position: "top-right",
    autoClose: 3000,
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsBtnDisable(true);

    const { username, email, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("All fields are required", toastOptions);
      setIsBtnDisable(false);
      return;
    }

    if (password.length < 4) {
      toast.error("Password too short", toastOptions);
      setIsBtnDisable(false);
      return;
    } else {
      if (password !== confirmPassword) {
        toast.error("Password does not match", toastOptions);
        setIsBtnDisable(false);
        return;
      } else {
        axios
          .post(registerRoute, form)
          .then((response) => {
            toast.success(response.data.message, toastOptions);
            localStorage.setItem("user_token", response.data.token);
            navigate("/");
            console.log(response.data);
            setIsBtnDisable(false);
          })
          .catch((err) => {
            console.log(err.response.data.message);
            toast.error(err.response.data.message, toastOptions);
            setIsBtnDisable(false);
          });
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="logo-container">
          <img src={logo} alt="Logo" />
          <h1>FlapChat</h1>
        </div>
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={(e) => handleChange(e)}
        />
        <button
          type="submit"
          disabled={isBtnDisable}
          className={isBtnDisable ? "disabled" : ""}>
          Create account
        </button>
        <div className="switch">
          Already have an account? <Link to={"/login"}>Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
