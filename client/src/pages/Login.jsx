import React, { useState } from "react";
import "./Form.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Chatting.png";
import { toast } from "react-toastify";
import { loginRoute } from "../utils/APIRoutes";
import { toastOptions } from "../App";

function Login() {
  const navigate = useNavigate();
  const [isBtnDisable, setIsBtnDisable] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsBtnDisable(true);

    const { email, password } = form;

    if (!email || !password) {
      toast.error("All fields are required", toastOptions);
      setIsBtnDisable(false);
      return;
    } else {
      axios
        .post(loginRoute, form)
        .then((response) => {
          // console.log(response.data);
          localStorage.setItem("user_token", response.data.token);
          toast.success(response.data.message, toastOptions);
          setIsBtnDisable(false);
          navigate("/");
        })
        .catch((err) => {
          // console.log(err.response.data.message);
          toast.error(err.response.data.message, toastOptions);
          setIsBtnDisable(false);
        });
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

        <button
          type="submit"
          disabled={isBtnDisable}
          className={isBtnDisable ? "disabled" : ""}>
          Login
        </button>
        <div className="switch">
          Doesn't have an account yet? <Link to={"/register"}>Signup</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
