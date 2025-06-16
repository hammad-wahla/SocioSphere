import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserCard = ({
  children,
  user,
  border,
  handleClose,
  setShowFollowers,
  setShowFollowing,
  msg,
}) => {
  const { theme } = useSelector((state) => state);

  const handleCloseAll = () => {
    if (handleClose) handleClose();
    if (setShowFollowers) setShowFollowers(false);
    if (setShowFollowing) setShowFollowing(false);
  };

  const showMsg = (user) => {
    return (
      <>
        <div
          style={{
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
            fontSize: "12px",
            lineHeight: "1.3",
          }}
        >
          {user.text}
        </div>
        {user.media.length > 0 && (
          <div style={{ color: "var(--text-muted)" }}>
            {user.media.length} <i className="fas fa-image" />
          </div>
        )}

        {user.call && (
          <span
            className="material-icons"
            style={{ color: "var(--text-muted)" }}
          >
            {user.call.times === 0
              ? user.call.video
                ? "videocam_off"
                : "phone_disabled"
              : user.call.video
              ? "video_camera_front"
              : "call"}
          </span>
        )}
      </>
    );
  };

  return (
    <div
      className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}
      style={{ color: "var(--text-primary)" }}
    >
      <div
        style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}
      >
        <Link
          to={`/profile/${user._id}`}
          onClick={handleCloseAll}
          className="d-flex align-items-center"
          style={{
            textDecoration: "none",
            color: "var(--text-primary)",
            border: "none",
            outline: "none",
          }}
        >
          <Avatar src={user.avatar} size="big-avatar" />

          <div
            style={{
              marginLeft: "12px",
              flex: 1,
              minWidth: 0,
            }}
          >
            <span
              className="d-block"
              style={{
                color: "var(--text-primary)",
                textDecoration: "none",
                borderBottom: "none",
                fontSize: "14px",
                fontWeight: "600",
                lineHeight: "1.3",
                marginBottom: "5px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.fullname}
            </span>

            <small
              style={{
                opacity: 0.7,
                color: "var(--text-muted)",
                textDecoration: "none",
                borderBottom: "none",
                fontSize: "12px",
                display: "block",
                lineHeight: "1.2",
                marginTop: "0px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {msg ? showMsg(user) : `@${user.username}`}
            </small>
          </div>
        </Link>
      </div>

      {children}
    </div>
  );
};

export default UserCard;
