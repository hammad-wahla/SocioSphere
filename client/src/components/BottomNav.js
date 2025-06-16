import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";

const BottomNav = () => {
  const { pathname } = useLocation();
  const { auth, notify } = useSelector((state) => state);

  const navItems = [
    {
      path: "/",
      icon: "fas fa-home",
      label: "Home"
    },
    {
      path: "/message",
      icon: "fas fa-comment-dots",
      label: "Messages"
    },
    {
      path: "/discover",
      icon: "fas fa-compass",
      label: "Discover"
    },
    {
      path: "/notifications",
      icon: "fas fa-bell",
      label: "Notify",
      badge: notify.data.filter((item) => !item.isRead).length
    },
    {
      path: "/settings",
      icon: "fas fa-cog",
      label: "Settings"
    },
    {
      path: `/profile/${auth.user._id}`,
      isProfile: true,
      label: "Profile"
    }
  ];

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-container">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`bottom-nav-item ${isActive(item.path) ? "active" : ""}`}
          >
            {item.isProfile ? (
              <div className="bottom-nav-avatar">
                <Avatar src={auth.user.avatar} size="bottom-nav-avatar" />
                {isActive(item.path) && <div className="active-indicator"></div>}
              </div>
            ) : (
              <div className="bottom-nav-icon-wrapper">
                <i className={item.icon}></i>
                {item.badge > 0 && (
                  <span className="bottom-nav-badge">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
            )}
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;