import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { updateTheme } from "../../redux/actions/themeAction";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import Avatar from "../Avatar";
import NotifyModal from "../NotifyModal";

const Menu = () => {
  const navLinks = [
    { label: "Home", icon: "fas fa-home", path: "/" },
    { label: "Messages", icon: "fas fa-comment-dots", path: "/message" },
    { label: "Discover", icon: "fas fa-compass", path: "/discover" },
  ];

  const { auth, theme, notify, message } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const notifyRef = useRef(null);
  const profileRef = useRef(null);

  const isActive = (pn) => {
    if (pn === pathname) return "active";
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setNotifyDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleNotifyDropdown = () => {
    // On mobile screens, redirect to notifications page instead of showing dropdown
    if (window.innerWidth < 768) {
      // Use React Router navigation instead of window.location
      window.location.pathname = '/notifications';
      return;
    }
    setNotifyDropdownOpen(!notifyDropdownOpen);
    setProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotifyDropdownOpen(false);
  };

  return (
    <div className="menu">
      <ul className="navbar-nav flex-row align-items-center">
        {navLinks.map((link, index) => (
          <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
            <Link
              className="nav-link nav-icon-link position-relative"
              to={link.path}
              title={link.label}
            >
              <i className={`${link.icon} nav-icon`}></i>
              <span className="nav-label d-none d-md-inline ms-1">
                {link.label}
              </span>
              
              {/* Message badge */}
              {link.path === "/message" && message.totalUnread > 0 && (
                <span className="notify-badge-count">
                  {message.totalUnread > 99 ? "99+" : message.totalUnread}
                </span>
              )}
            </Link>
          </li>
        ))}

        {/* Notifications - Desktop shows dropdown, mobile navigates to page */}
        <li className="nav-item dropdown px-2" ref={notifyRef}>
          {isMobile ? (
            // Mobile - Link to notifications page
            <Link
              className="nav-link position-relative nav-icon-link"
              to="/notifications"
              title="Notifications"
            >
              <i
                className={`fas fa-bell nav-icon ${
                  notify.data.filter((item) => !item.isRead).length > 0
                    ? "text-danger"
                    : ""
                }`}
              ></i>

              {notify.data.filter((item) => !item.isRead).length > 0 && (
                <span className="notify-badge-count">
                  {notify.data.filter((item) => !item.isRead).length > 99
                    ? "99+"
                    : notify.data.filter((item) => !item.isRead).length}
                </span>
              )}
            </Link>
          ) : (
            // Desktop - Show dropdown
            <>
              <button
                className="nav-link position-relative nav-icon-link btn border-0 bg-transparent"
                type="button"
                onClick={toggleNotifyDropdown}
                title="Notifications"
              >
                <i
                  className={`fas fa-bell nav-icon ${
                    notify.data.filter((item) => !item.isRead).length > 0
                      ? "text-danger"
                      : ""
                  }`}
                ></i>

                {notify.data.filter((item) => !item.isRead).length > 0 && (
                  <span className="notify-badge-count">
                    {notify.data.filter((item) => !item.isRead).length > 99
                      ? "99+"
                      : notify.data.filter((item) => !item.isRead).length}
                  </span>
                )}
              </button>

              <div
                className={`dropdown-menu dropdown-menu-end notification-dropdown ${
                  notifyDropdownOpen ? "show" : ""
                }`}
                style={{ display: notifyDropdownOpen ? "block" : "none" }}
              >
                <NotifyModal
                  onNotificationClick={() => setNotifyDropdownOpen(false)}
                />
              </div>
            </>
          )}
        </li>

        {/* Profile Dropdown */}
        <li className="nav-item dropdown px-2" ref={profileRef}>
          <button
            className="nav-link d-flex align-items-center profile-dropdown btn border-0 bg-transparent"
            type="button"
            onClick={toggleProfileDropdown}
            title={`${auth.user.fullname} - Account Menu`}
          >
            <Avatar src={auth.user.avatar} size="header-avatar" />
            <span className="ms-2 ml-2 d-none d-lg-inline user-name">
              {auth.user.fullname}
            </span>
          </button>

          <div
            className={`dropdown-menu dropdown-menu-end profile-dropdown-menu ${
              profileDropdownOpen ? "show" : ""
            }`}
            style={{ display: profileDropdownOpen ? "block" : "none" }}
          >
            <div className="dropdown-header">
              <div className="d-flex align-items-center">
                <Avatar src={auth.user.avatar} size="small-avatar" />
                <div className="ms-2">
                  <div className="fw-bold">{auth.user.fullname}</div>
                  <small className="text-muted">@{auth.user.username}</small>
                </div>
              </div>
            </div>
            <div className="dropdown-divider"></div>

            <Link
              className="dropdown-item"
              to={`/profile/${auth.user._id}`}
              onClick={() => setProfileDropdownOpen(false)}
            >
              <i className="fas fa-user me-2"></i>
              My Profile
            </Link>

            <Link
              className="dropdown-item"
              to="/settings"
              onClick={() => setProfileDropdownOpen(false)}
            >
              <i className="fas fa-cog me-2"></i>
              Settings
            </Link>

            <button
              type="button"
              className="dropdown-item border-0 bg-transparent text-start w-100"
              onClick={() => {
                const newTheme = theme ? "light" : "dark";
                dispatch(updateTheme(newTheme, auth));
              }}
            >
              <i className={`fas ${theme ? "fa-sun" : "fa-moon"} me-2`}></i>
              {theme ? "Light Mode" : "Dark Mode"}
            </button>

            <div className="dropdown-divider"></div>

            <button
              type="button"
              className="dropdown-item text-danger border-0 bg-transparent text-start w-100"
              onClick={() => {
                dispatch(logout());
                setProfileDropdownOpen(false);
              }}
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Sign Out
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
