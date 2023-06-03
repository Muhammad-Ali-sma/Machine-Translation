import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useSelector } from 'react-redux';
import "./styles.css";
import Forbidden from "./pages/403";

function App() {
  const loginStatus = useSelector(state => state.auth.login);
 
  return (
    <>

      {loginStatus === 'Login' ? <Home /> : loginStatus === '403' ? <Forbidden /> : <Login />}
    </>
  );
}

export default App;
