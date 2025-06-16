import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../../../redux/actions/commentAction";

const CommentMenu = ({ post, comment, setOnEdit }) => {
  const { auth, socket, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Update dropdown position on scroll
  const updateDropdownPosition = () => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 160;
      const padding = 8;

      setDropdownPosition({
        top: rect.bottom + padding,
        left: Math.max(10, rect.right - dropdownWidth),
      });
    }
  };

  // Close dropdown when clicking outside and handle scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    const handleScroll = () => {
      updateDropdownPosition();
    };

    const handleResize = () => {
      updateDropdownPosition();
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true); // Use capture to catch all scroll events
      window.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [showDropdown]);

  const handleRemove = () => {
    if (post.user._id === auth.user._id || comment.user._id === auth.user._id) {
      dispatch(deleteComment({ post, auth, comment, socket }));
    }
    setShowDropdown(false);
  };

  const handleEdit = () => {
    setOnEdit(true);
    setShowDropdown(false);
  };

  const handleDropdownToggle = () => {
    if (!showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 160;
      const padding = 8;

      setDropdownPosition({
        top: rect.bottom + padding,
        left: Math.max(10, rect.right - dropdownWidth),
      });
    }
    setShowDropdown(!showDropdown);
  };

  const MenuItem = () => {
    const itemStyle = {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      margin: "2px 0",
      padding: "8px 12px",
      borderRadius: "8px",
      transition: "all 0.2s ease",
      color: theme ? "#ffffff" : "#333333",
      fontSize: "14px",
      cursor: "pointer",
      border: "none",
      background: "transparent",
      width: "100%",
      textAlign: "left",
    };

    const hoverStyle = {
      background: "rgba(13, 202, 240, 0.1)",
      color: "#0dcaf0",
    };

    return (
      <>
        <div
          className="dropdown-item"
          onClick={handleEdit}
          style={itemStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, itemStyle)}
        >
          <span className="material-icons" style={{ fontSize: "18px" }}>
            create
          </span>{" "}
          Edit
        </div>
        <div
          className="dropdown-item"
          onClick={handleRemove}
          style={itemStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, itemStyle)}
        >
          <span className="material-icons" style={{ fontSize: "18px" }}>
            delete_outline
          </span>{" "}
          Remove
        </div>
      </>
    );
  };

  return (
    <div className="menu">
      {(post.user._id === auth.user._id ||
        comment.user._id === auth.user._id) && (
        <div className="nav-item dropdown">
          <span
            ref={buttonRef}
            className="material-icons"
            onClick={handleDropdownToggle}
            style={{ cursor: "pointer" }}
          >
            more_vert
          </span>

          {showDropdown && dropdownPosition.top > 0 &&
            ReactDOM.createPortal(
              <div
                ref={menuRef}
                className="dropdown-menu show"
                style={{
                  position: "fixed",
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  zIndex: 999999,
                  width: "160px",
                  border: `1px solid ${theme ? "#444" : "#e0e0e0"}`,
                  borderRadius: "12px",
                  background: theme ? "#2a2a2a" : "#ffffff",
                  color: theme ? "#ffffff" : "#333333",
                  boxShadow: theme
                    ? "0 8px 25px rgba(0, 0, 0, 0.4)"
                    : "0 8px 25px rgba(0, 0, 0, 0.15)",
                  backdropFilter: "blur(20px)",
                  padding: "8px",
                }}
              >
                {post.user._id === auth.user._id ? (
                  comment.user._id === auth.user._id ? (
                    MenuItem()
                  ) : (
                    <div
                      className="dropdown-item"
                      onClick={handleRemove}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        margin: "2px 0",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        color: theme ? "#ffffff" : "#333333",
                        fontSize: "14px",
                        cursor: "pointer",
                        border: "none",
                        background: "transparent",
                        width: "100%",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) =>
                        Object.assign(e.target.style, {
                          background: "rgba(13, 202, 240, 0.1)",
                          color: "#0dcaf0",
                        })
                      }
                      onMouseLeave={(e) =>
                        Object.assign(e.target.style, {
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          margin: "2px 0",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          color: theme ? "#ffffff" : "#333333",
                          fontSize: "14px",
                          cursor: "pointer",
                          border: "none",
                          background: "transparent",
                          width: "100%",
                          textAlign: "left",
                        })
                      }
                    >
                      <span
                        className="material-icons"
                        style={{ fontSize: "18px" }}
                      >
                        delete_outline
                      </span>{" "}
                      Remove
                    </div>
                  )
                ) : (
                  comment.user._id === auth.user._id && MenuItem()
                )}
              </div>,
              document.body
            )}
        </div>
      )}
    </div>
  );
};

export default CommentMenu;
