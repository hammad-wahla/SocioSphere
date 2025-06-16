import React, { useState, useEffect, useRef } from "react";
import Avatar from "../Avatar";
import { imageShow, videoShow } from "../../utils/mediaShow";
import { useSelector, useDispatch } from "react-redux";
import { deleteMessages } from "../../redux/actions/messageAction";
import Times from "./Times";
import ConfirmModal from "../ConfirmModal";

const MsgDisplay = ({ user, msg, theme, data }) => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const optionsRef = useRef(null);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteMessages = () => {
    if (!data) return;
    setShowDeleteModal(true);
    setShowOptions(false);
  };

  const confirmDeleteMessage = () => {
    dispatch(deleteMessages({ msg, data, auth }));
    setShowDeleteModal(false);
  };

  const cancelDeleteMessage = () => {
    setShowDeleteModal(false);
  };

  const handleCopyMessage = () => {
    if (msg.text) {
      navigator.clipboard.writeText(msg.text);
      // You could add a toast notification here
    }
    setShowOptions(false);
  };

  const isOwnMessage = user._id === auth.user._id;
  const hasTextContent = msg.text && msg.text.trim() !== "";
  const hasCallContent = msg.call;
  const hasMediaContent = msg.media && msg.media.length > 0;

  return (
    <div className="message-display-modern">
      <div className="message-content-wrapper">
        {/* Options button for received messages (left side) */}
        {!isOwnMessage && (
          <div
            className="message-options-container options-left"
            ref={optionsRef}
          >
            <button
              className="message-options-btn"
              onClick={() => setShowOptions(!showOptions)}
              title="Message options"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>

            {showOptions && (
              <div className="message-options-menu menu-left">
                {hasTextContent && (
                  <button className="option-item" onClick={handleCopyMessage}>
                    <i className="fas fa-copy"></i>
                    Copy Text
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Avatar for received messages */}
        {user._id !== auth.user._id && (
          <div className="message-avatar">
            <Avatar src={user.avatar} size="tiny-avatar" />
          </div>
        )}

        <div
          className={`message-bubble ${
            user._id === auth.user._id ? "sent" : "received"
          }`}
        >
          {/* Text content */}
          {msg.text && <div className="message-text">{msg.text}</div>}

          {/* Media content */}
          {msg.media && msg.media.length > 0 && (
            <div className="message-media">
              {msg.media.map((item, index) => (
                <div key={index} className="media-item">
                  {item.url.match(/video/i)
                    ? videoShow(item.url)
                    : imageShow(item.url)}
                </div>
              ))}
            </div>
          )}

          {/* Call content */}
          {msg.call && (
            <div className="message-call">
              <div className="call-icon">
                <i
                  className={`fas ${
                    msg.call.times === 0
                      ? msg.call.video
                        ? "fa-video-slash"
                        : "fa-phone-slash"
                      : msg.call.video
                      ? "fa-video"
                      : "fa-phone"
                  }`}
                  style={{
                    color: msg.call.times === 0 ? "#ef4444" : "#22c55e",
                  }}
                ></i>
              </div>
              <div className="call-info">
                <div className="call-type">
                  {msg.call.video ? "Video Call" : "Audio Call"}
                </div>
                <div className="call-duration">
                  {msg.call.times > 0 ? (
                    <Times total={msg.call.times} />
                  ) : (
                    "Missed call"
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Message timestamp */}
          <div className="message-timestamp">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Avatar for sent messages */}
        {user._id === auth.user._id && (
          <div className="message-avatar">
            <Avatar src={user.avatar} size="tiny-avatar" />
          </div>
        )}

        {/* Options button for sent messages (right side) */}
        {isOwnMessage && (
          <div
            className="message-options-container options-right"
            ref={optionsRef}
          >
            <button
              className="message-options-btn"
              onClick={() => setShowOptions(!showOptions)}
              title="Message options"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>

            {showOptions && (
              <div className="message-options-menu menu-right">
                {hasTextContent && (
                  <button className="option-item" onClick={handleCopyMessage}>
                    <i className="fas fa-copy"></i>
                    Copy Text
                  </button>
                )}
                <button
                  className="option-item delete-option"
                  onClick={handleDeleteMessages}
                >
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteMessage}
        onConfirm={confirmDeleteMessage}
        title="Delete Message"
        message="Do you want to delete this message?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default MsgDisplay;
