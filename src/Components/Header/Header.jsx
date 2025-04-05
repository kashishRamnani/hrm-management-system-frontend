import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Dropdown,
  Button,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext"; 

import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

const Header = () => {
  const [showSearchBox, setShowSearchBox] = useState(false); // Toggle search box visibility
  const [isDarkMode, setIsDarkMode] = useState(false); // Track dark mode
  const [query, setQuery] = useState(""); // Track search query
  const { revokeAuth, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleLogout = () => {
    revokeAuth(); 
    navigate("/signin");
  };

  
  const handleSearchToggle = () => {
    setShowSearchBox(!showSearchBox);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (query.trim()) {
      navigate(`${location.pathname}?q=${query}`) // Navigate to search results page
    }
  };
  const handleUpadatePassword = ()=>{
    navigate("/updatepasswor")
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="d-flex content-wrapper">
      <Navbar expand="lg">
        <div className="d-flex">
          {/* Search Bar */}
          <Form className="d-flex" onSubmit={handleSearchSubmit}>
            <div className={`input-group ${showSearchBox ? "expanded" : ""}`}>
              <span
                className="input-group-text border-1"
                onClick={handleSearchToggle}
                role="button"
              >
                <i
                  className="fa fa-search"
                  aria-hidden="true"
                  style={{ color: "#a6a6a6" }}
                ></i>
              </span>
              <FormControl
                type="search"
                placeholder="Search..."
                className="border-1 form-control-sm formControl rounded-end-pill"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent form submission reload
                    handleSearchSubmit(e);
                  }
                }}
              />
            </div>
          </Form>
        </div>

        {/* Right Section */}
        <div className="d-flex flex-row ms-auto align-items-center">
          <Nav.Item className="me-2">
            <i
              className="bi bi-fullscreen rounded-icon icon"
              onClick={toggleFullScreen}
            ></i>
          </Nav.Item>
          <Nav.Item className="me-2 rounded-icon icon">
            <Button
              variant="link"
              onClick={toggleDarkMode}
              className="ms-2"
              style={{ color: isDarkMode ? "goldenrod" : "white" }}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </Button>
          </Nav.Item>
        </div>

        {/* User Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle variant="" className="d-flex align-items-center border-0 p-2">
            <div>
              {user?.role || "Role"} - {user?.name || "Name"}
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="p-0">
            <Dropdown.Item onClick={handleLogout} className="dropdown-font">
              Logout
            </Dropdown.Item>
            <Dropdown.Item  onClick={ handleUpadatePassword } className="dropdown-font">
              Update Paswaord
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
    </div>
  );
};

export default Header;
