import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Cart from '../screens/Cart';
import { useCart } from './ContextReducer'; // Adjust the path as necessary


export default function Navbar() {
  let data = useCart();
  const [cartView, setCartView] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if authToken exists in localStorage
    const token = localStorage.getItem("authToken");
    console.log("AuthToken in Navbar:", token); // Debug log to verify token presence
    setIsLoggedIn(!!token); // Update isLoggedIn based on token presence
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">
            QuickBite
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active fs-5" aria-current="page" to="/">
                  Home
                </Link>
              </li>

              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link active fs-5" to="/orders">
                      My Orders
                    </Link>
                  </li>
                  
                </>
              )}
            </ul>
            <div className="d-flex">
              {!isLoggedIn ? (
                <>
                  <Link className="btn bg-white text-success mx-1" to="/login">
                    Login
                  </Link>
                  <Link className="btn bg-white text-success mx-1" to="/createuser">
                    SignUp
                  </Link>
                </>
              ) : (
                <>
                  <Link className="btn bg-white text-info mx-2" to="/cart" onClick={() => {setCartView(true)}}>
                    My Cart {" "}
                    <Badge pill bg="danger" > {data.length} </Badge>
                  </Link>
                  {cartView? <Modal onClose={() => setCartView(false)}><Cart/></Modal>:null}
                  <button
                    className="btn bg-white text-danger mx-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
