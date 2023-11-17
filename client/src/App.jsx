import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SetAvatar from "./pages/SetAvatar";
import { createContext, useRef, useState } from "react";
import Convo from "./components/Convo";
import Welcome from "./components/Welcome";

export const Context = createContext();

export const toastOptions = {
  className: "toast",
  position: "top-right",
  autoClose: 3000,
};

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [currentChat, setCurrentChat] = useState({});

  const socket = useRef();

  return (
    <>
      <Context.Provider
        value={{
          currentUser,
          setCurrentUser,
          currentChat,
          setCurrentChat,
          socket,
        }}>
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/setAvatar" element={<SetAvatar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />}>
              <Route path="/" element={<Welcome />} />
              <Route path="/:id" element={<Convo />} />
            </Route>
          </Routes>
        </Router>
        <ToastContainer />
      </Context.Provider>
    </>
  );
}

export default App;
