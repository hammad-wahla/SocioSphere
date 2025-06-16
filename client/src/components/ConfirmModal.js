import React from "react";
import "../styles/confirm-modal.css";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  type = "default", // default, danger
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleBackdropClick}>
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <h3 className="confirm-modal-title">{title}</h3>
        </div>

        <div className="confirm-modal-body">
          <p className="confirm-modal-message">{message}</p>
        </div>

        <div className="confirm-modal-footer">
          <button className="confirm-modal-btn cancel-btn" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className={`confirm-modal-btn confirm-btn ${
              type === "danger" ? "danger" : ""
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
