import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";
import {
  faBars,
  faDashboard,
  faChartBar,
  faCalendarAlt,
  faUsers,
  faChartSimple,
  faFileUpload,
  faHistory,
  faMagnifyingGlassChart,
  faBox,
  faCalendarMinus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faUserTie,
  faBuilding,
  faChair,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";


function useIsLargeScreen() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 790);
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 790);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isLargeScreen;
}

function Sidebar() {
  const [createdNav, SetCreatedNav]=useState(false);
  const [dropdownOptions]=useState({
    hr: [
      { label: "All HRs", path: "/admin/all-hr" },
      { label: "Register HR", path: "/admin/hr-register" },
    ],
    employees: [
      { label: "All Employees", path: "/employees" },
      { label: "Add an Employee", path: "/register/employee" },
    ],
    employsposition: [
      { label: "All Positions", path: "/positions" },
      { label: "Add Position", path: "/assign/position" },
      { label: "Position Details", path: "/position-details" },
    ],
    jobPosting: [
      { label: "All Jobs", path: "/jobs" },
      { label: "Post a Job", path: "/post/job" },
    ],
    compensation: [
      { label: "All Compensation", path: "/admin/all-compensation" },
      { label: "Add Compensation", path: "/admin/add-compensation" },
    ],
    jobhistory: [
      { label: "View Job History", path: "/admin/all-job-history" },
      { label: "Add Job History", path: "/admin/add-job-history" },
    ],
    employsperformance: [
      { label: "All Performance", path: "/admin/performance" },
      { label: "Add Performance", path: "/admin/add-performance" },
    ],
    attendance: [
      { label: "Attendance", path: "/attendance" },
      { label: "Attendance Form", path: "/post/attendance" },
    ],
  });
  const isLargeScreen = useIsLargeScreen();
  const {user} = useAuth();
  const [isExpanded, setIsExpanded] = useState(window.innerWidth > 790);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const sidebarRef = useRef(null);
  const [navItems, setNavItems] = useState([]);
  const location = useLocation();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const toggleDropdown = (key) => {
    if (!isExpanded) {
      setIsExpanded(true); // Expand the sidebar if collapsed
    } else {
      setActiveDropdown(activeDropdown === key ? null : key); // Toggle dropdown
    }
  };
  

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsExpanded(isLargeScreen);
  }, [isLargeScreen]);

  useEffect(() => {
    if(createdNav == false){

      const navLinks = new Set([{ key: "dashboard", label: "Dashboard", icon: faDashboard, path: "/admin-dashboard"}]);
      
      if (user.role == "admin") {
        navLinks.add({ key: "hr", label: "HR", icon: faUserTie });
      }

      const links = [{ key: "attendance", label: "Attendance", icon: faCalendarAlt },
        { key: "compensation", label: "Compensation", icon: faChartBar },
        { key: "departments", label: "All Departments", icon: faBuilding, path: "/admin/all-departments" },
        { key: "employees", label: "Employees", icon: faUser },
        { key: "employsposition", label: "Employees Position", icon: faChair },
        { key: "employsperformance", label: "Employees Performance", icon: faChartSimple },
        { label: "All Job Applications", icon: faMagnifyingGlassChart, path: "/all/applications" },
        { key: "jobPosting", label: "Job Posting", icon: faFileUpload },
        { key: "jobhistory", label: "Job History", icon: faHistory },
        { label: "All Complaints", path: "/AllComplaint", icon: faBox},
        { label: "All Leaves", path: "/allleaves", icon: faCalendarAlt}
      ]

      links.map(link => navLinks.add(link));

      setNavItems([...navLinks])
      SetCreatedNav(true);
    }
  }, [user, createdNav]);

  return (
    <div ref={sidebarRef} className={`sidebar ${isExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      <div className="sidebar-header">
        {isExpanded && (
          <NavLink to="/admin-dashboard" className="sidebar-logo">
            <img src="/src/assets/images/Logo/Dark_logo.png" alt="Logo" className="logo" />
          </NavLink>
        )}
        <button className="sidebar-toggle rounded-icon" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <ul className="sidebar-nav">
        {navItems.map((item, index) => {
          const hasDropdown = dropdownOptions[item.key];
          return (
            <li
              key={index}
              className={`sidebar-nav-item ${activeDropdown === item.key ? "expanded" : ""}`}
            >
         {hasDropdown ? (
  <Dropdown show={activeDropdown === item.key}>
    <Dropdown.Toggle
      variant="link"
      id={`dropdown-${item.key}`}
      className="sidebar-link text-decoration-none px-0"
      onClick={() => toggleDropdown(item.key)}
    >
      <FontAwesomeIcon icon={item.icon} />
      {isExpanded && <span className="ps-3">{item.label}</span>}
    </Dropdown.Toggle>
    {isExpanded && (
      <div className="dropdown-menu p-0 ms-4">
        {dropdownOptions[item.key].map((option) => (
          <Dropdown.Item
            as={Link}
            to={option.path}
            key={option.path}
            onClick={() => setActiveDropdown(null)}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </div>
    )}
  </Dropdown>
) : (
  <Link
    to={item.path || `/${item.key}`}
    className="sidebar-link text-decoration-none"
  >
    <FontAwesomeIcon icon={item.icon} />
    {isExpanded && <span className="px-3">{item.label}</span>}
  </Link>
)}

            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
