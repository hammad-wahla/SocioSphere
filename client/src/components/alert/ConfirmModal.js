import React from "react";
import { useSelector } from "react-redux";

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger", // danger, success, primary, warning
}) => {
  const { theme } = useSelector((state) => state);

  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirm-modal" data-theme={theme ? "dark" : "light"}>
        <div className="confirm-modal-header">
          <h5 className="confirm-modal-title">
            <i
              className={`fas ${
                confirmVariant === "danger"
                  ? "fa-exclamation-triangle text-danger"
                  : confirmVariant === "success"
                  ? "fa-check-circle text-success"
                  : confirmVariant === "warning"
                  ? "fa-exclamation-circle text-warning"
                  : "fa-info-circle text-primary"
              }`}
            ></i>
            {title}
          </h5>
        </div>

        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>

        <div className="confirm-modal-footer">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className={`btn btn-${confirmVariant}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
