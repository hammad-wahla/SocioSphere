import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import moment from "moment";
import {
  isReadNotify,
  NOTIFY_TYPES,
  deleteAllNotifies,
} from "../redux/actions/notifyAction";
import { showConfirmDialog, showToast } from "../utils/confirmDialog";

const NotifyModal = ({ onNotificationClick }) => {
  const { auth, notify } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleIsRead = (msg) => {
    dispatch(isReadNotify({ msg, auth }));
    // Close dropdown after clicking notification
    if (onNotificationClick) {
      setTimeout(() => onNotificationClick(), 100);
    }
  };

  const handleSound = () => {
    dispatch({ type: NOTIFY_TYPES.UPDATE_SOUND, payload: !notify.sound });
  };

  const handleDeleteAll = async () => {
    const unreadCount = notify.data.filter((item) => !item.isRead).length;

    if (notify.data.length === 0) return;

    const confirmMessage =
      unreadCount > 0
        ? `You have ${unreadCount} unread notification${
            unreadCount > 1 ? "s" : ""
          }. Are you sure you want to delete all notifications?`
        : "Are you sure you want to delete all notifications?";

    showConfirmDialog(dispatch, {
      title: "Delete All Notifications",
      message: confirmMessage,
      confirmText: "Delete All",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        setLoading(true);
        try {
          await dispatch(deleteAllNotifies(auth.token));
          showToast(dispatch, {
            type: "success",
            message: "All notifications deleted successfully!",
          });
        } catch (error) {
          console.error("Error deleting notifications:", error);
          showToast(dispatch, {
            type: "error",
            message: "Failed to delete notifications",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getNotificationIcon = (msg) => {
    if (msg.text.includes("liked")) return "fas fa-heart text-danger";
    if (msg.text.includes("commented")) return "fas fa-comment text-primary";
    if (msg.text.includes("shared")) return "fas fa-share text-success";
    if (msg.text.includes("follow")) return "fas fa-user-plus text-info";
    return "fas fa-bell text-secondary";
  };

  const formatTimeAgo = (date) => {
    const now = moment();
    const notificationTime = moment(date);
    const diffInHours = now.diff(notificationTime, "hours");

    if (diffInHours < 1) return moment(date).fromNow();
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return moment(date).format("MMM DD");
  };

  const unreadCount = notify.data.filter((item) => !item.isRead).length;

  return (
    <div className="modern-notify-modal">
      {/* Header */}
      <div className="notify-header">
        <div className="notify-title">
          <h6 className="mb-0">
            <i className="fas fa-bell me-2"></i>
            Notifications
            {unreadCount > 0 && (
              <span className="unread-badge ms-2">{unreadCount}</span>
            )}
          </h6>
        </div>
        <div className="notify-controls">
          <button
            className={`sound-btn ${notify.sound ? "active" : ""}`}
            onClick={handleSound}
            title={
              notify.sound ? "Turn off notifications" : "Turn on notifications"
            }
          >
            <i
              className={`fas ${notify.sound ? "fa-bell" : "fa-bell-slash"}`}
            ></i>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="notify-content">
        {loading ? (
          <div className="notify-loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : notify.data.length === 0 ? (
          <div className="notify-empty">
            <div className="empty-icon">
              <i className="fas fa-bell-slash"></i>
            </div>
            <h6>No notifications yet</h6>
            <p>When you get notifications, they'll show up here</p>
          </div>
        ) : (
          <div className="notify-list">
            {notify.data.map((msg, index) => (
              <div
                key={index}
                className={`notify-item ${!msg.isRead ? "unread" : ""}`}
              >
                <Link
                  to={msg.url}
                  className="notify-link"
                  onClick={() => handleIsRead(msg)}
                >
                  <div className="notify-avatar">
                    <Avatar src={msg.user.avatar} size="medium-avatar" />
                    <div className="notify-type-icon">
                      <i className={getNotificationIcon(msg)}></i>
                    </div>
                  </div>

                  <div className="notify-body">
                    <div className="notify-main">
                      <span className="notify-username">
                        {msg.user.username}
                      </span>
                      <span className="notify-action">{msg.text}</span>
                      {!msg.isRead && <div className="unread-dot"></div>}
                    </div>

                    {msg.content && (
                      <p className="notify-content-preview">
                        "{msg.content.slice(0, 50)}..."
                      </p>
                    )}

                    <div className="notify-time">
                      {formatTimeAgo(msg.createdAt)}
                    </div>
                  </div>

                  {msg.image && (
                    <div className="notify-media">
                      {msg.image.match(/video/i) ? (
                        <video src={msg.image} className="notify-video" muted />
                      ) : (
                        <img
                          src={msg.image}
                          alt="notification media"
                          className="notify-image"
                        />
                      )}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notify.data.length > 0 && (
        <div className="notify-footer">
          <button
            className="delete-all-btn"
            onClick={handleDeleteAll}
            disabled={loading}
          >
            <i className="fas fa-trash-alt me-2"></i>
            Clear All
            {loading && <i className="fas fa-spinner fa-spin ms-2"></i>}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotifyModal;
