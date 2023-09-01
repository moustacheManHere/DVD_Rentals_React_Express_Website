// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
import React from 'react';
import {useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import axios from "axios"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home"
import Error from "./pages/error"
import Login from "./pages/signIn"
import SignUp from "./pages/signUp"
import Dvd from "./pages/newDetails"
import DvdPub from "./pages/publicDetails"
import Cart from "./pages/cart"
import Payment from "./pages/payment"
import UserProf from "./pages/userProfile"
import AdminProf from "./pages/adminProfile"
import Admin from "./pages/admin"
import Hist from "./pages/userHist"
import Review from "./pages/review"
import Request from "./pages/requests"

function App() {
  const [token, setToken] = useState(window.localStorage.getItem('token') || null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    window.localStorage.setItem('token', token);
  }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:3001/checkValid', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          setUserType(response.data.type);
        })
        .catch((error) => {
          if(error.response.status==401){
            window.localStorage.setItem("token",null)
          }
          setUserType(null);
        });
    } else {
      setUserType(null);
    }
  }, []);

  let routes;
  if (userType === 'staff') {
    routes = (
      <Routes>
        <Route exact path="/" render element={<Admin token={token} tokenHandler = {setToken} typeHandle={setUserType} userType="staff"/>} />
        <Route path="/profile" element={<AdminProf token={token} tokenHandler = {setToken} typeHandle={setUserType} userType="staff"/>} />
        <Route path="*" element={<Error  userType="staff"/>} />
      </Routes>
    );
  } else if (userType === 'customer') {
    routes = (
      <Routes>
        <Route exact path="/" element={<Home userType="customer"/>} />
        <Route path="*" element={<Error userType="public"/>} />
        <Route path="/profile" element={<UserProf token={token} tokenHandler = {setToken} typeHandle={setUserType} userType="customer"/>} />
        <Route path="/cart" element={<Cart token={token} tokenHandler = {setToken} typeHandle={setUserType} userType="customer"/>} />
        <Route path="/payment/:id" element={<Payment  tokenHandler = {setToken} typeHandle={setUserType} token={token} userType="customer"/>} />
        <Route path="/history" element={<Hist token={token} tokenHandler = {setToken} typeHandle={setUserType} userType="customer"/>} />
        <Route path="/review" element={<Review token={token} tokenHandler = {setToken} typeHandle={setUserType} userType="customer"/>} />
        <Route path="/request" element={<Request token={token} tokenHandler = {setToken} typeHandle={setUserType} userType="customer"/>} />
        <Route path="/dvd/:id" element={<Dvd token={token} tokenHandler = {setToken} typeHandle={setUserType} userType="customer"/>} />

      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Home userType="public"/>} />
        <Route path="/login" element={<Login userType="public" typeHandle={setUserType} tokenHandler = {setToken}/>} />
        <Route path="/signUp" element={<SignUp userType="public" typeHandle={setUserType} tokenHandler = {setToken}/>} />
        <Route path="/dvd/:id" element={<DvdPub userType="public"/>} />
        <Route path="*" element={<Error userType="public"/>} />
      </Routes>
    );
  }

  return (
    <BrowserRouter>
      {routes}
    </BrowserRouter>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

