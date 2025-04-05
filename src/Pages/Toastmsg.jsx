import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Toastmsg = ({ message, duration = 3000, type = "success" }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer;
    if (message) {
      setShow(true);
      timer = setTimeout(() => {
        setShow(false);
      }, duration);
    }

    return () => clearTimeout(timer); 
  }, [message, duration]);

  // Define Bootstrap classes for different toast types
  const toastTypeClass = {
    success: "bg-success text-white",
    error: "bg-danger text-white",
    info: "bg-info text-white",
    warning: "bg-warning text-dark",
  };

  return (
    <div
      className={`toast align-items-center ${show ? "show" : ""} ${
        toastTypeClass[type] || toastTypeClass.info
      }`}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1050,
        minWidth: "250px",
        borderRadius: "5px",
        opacity: show ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close me-2 m-auto"
          onClick={() => setShow(false)}
        ></button>
      </div>
    </div>
  );
};

export default Toastmsg;
