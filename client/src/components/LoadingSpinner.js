import React from "react";

const LoadingSpinner = ({
  size = "medium",
  text = "Loading...",
  type = "spinner",
}) => {
  const getSpinnerClass = () => {
    switch (size) {
      case "small":
        return "loading-spinner-sm";
      case "large":
        return "loading-spinner-lg";
      default:
        return "loading-spinner-md";
    }
  };

  const renderSpinner = () => {
    switch (type) {
      case "dots":
        return (
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      case "pulse":
        return <div className="loading-pulse"></div>;
      case "bars":
        return (
          <div className="loading-bars">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        );
      default:
        return <div className={`loading-spinner ${getSpinnerClass()}`}></div>;
    }
  };

  return (
    <div className="loading-container">
      <div className="loading-content">
        {renderSpinner()}
        {text && <p className="loading-text">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
