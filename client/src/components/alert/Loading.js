import React from "react";
import { useSelector } from "react-redux";

const Loading = () => {
  const { theme } = useSelector((state) => state);

  return (
    <div className="global-loading-overlay">
      <div className="global-loading-content">
        <div className="sociosphere-loader">
          <div className="loader-logo">
            <div className="circle-outer">
              <div className="circle-inner"></div>
            </div>
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay"></div>
          </div>
          <div className="loader-text">
            <span className="brand-name">SocioSphere</span>
            <span className="loading-dots">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
