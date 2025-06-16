import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resendVerification } from "../redux/actions/authAction";

const EmailVerificationNotice = ({ email, onClose }) => {
  const dispatch = useDispatch();
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    setIsResending(true);
    await dispatch(resendVerification(email));
    setIsResending(false);
  };

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.9))",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow:
              "0 20px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="modal-header"
            style={{
              background: "linear-gradient(135deg, #0dcaf0, #0bb5d6)",
              color: "white",
              borderRadius: "20px 20px 0 0",
              border: "none",
              padding: "20px 25px",
            }}
          >
            <h5
              className="modal-title"
              style={{
                fontWeight: "700",
                fontSize: "18px",
                letterSpacing: "0.5px",
              }}
            >
              <i className="fas fa-envelope-open-text mr-3"></i>
              Email Verification Required
            </h5>
            <button
              type="button"
              className="close text-white"
              onClick={onClose}
              aria-label="Close"
              style={{
                fontSize: "24px",
                fontWeight: "300",
                opacity: "0.8",
                transition: "opacity 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.opacity = "1")}
              onMouseOut={(e) => (e.target.style.opacity = "0.8")}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div
            className="modal-body text-center"
            style={{
              padding: "30px 25px",
            }}
          >
            <div className="mb-4">
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(13, 202, 240, 0.1), rgba(13, 202, 240, 0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto",
                  boxShadow: "0 8px 25px rgba(13, 202, 240, 0.2)",
                }}
              >
                <i
                  className="fas fa-envelope fa-2x"
                  style={{ color: "#0dcaf0" }}
                ></i>
              </div>
            </div>

            <h4
              className="mb-3"
              style={{
                color: "#2c3e50",
                fontWeight: "700",
                fontSize: "24px",
              }}
            >
              Check Your Email!
            </h4>

            <p
              className="mb-3"
              style={{
                color: "#495057",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              We've sent a verification link to:
            </p>

            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(13, 202, 240, 0.08), rgba(13, 202, 240, 0.04))",
                padding: "12px 20px",
                borderRadius: "12px",
                border: "1px solid rgba(13, 202, 240, 0.2)",
                marginBottom: "20px",
              }}
            >
              <p
                className="font-weight-bold mb-0"
                style={{
                  color: "#0dcaf0",
                  fontSize: "16px",
                  wordBreak: "break-word",
                }}
              >
                {email}
              </p>
            </div>

            <p
              className="mb-4"
              style={{
                color: "#6c757d",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              Please click the verification link in your email to activate your
              account. You won't be able to login until your email is verified.
            </p>

            <div
              className="mb-3"
              style={{
                background: "rgba(248, 249, 250, 0.8)",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid rgba(0, 0, 0, 0.05)",
              }}
            >
              <small
                style={{
                  color: "#6c757d",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                💡 Didn't receive an email? Check your spam folder or click
                resend below.
              </small>
            </div>
          </div>

          <div
            className="modal-footer justify-content-center"
            style={{
              borderTop: "1px solid rgba(0, 0, 0, 0.05)",
              padding: "20px 25px",
              gap: "12px",
            }}
          >
            <button
              className="btn"
              onClick={handleResendVerification}
              disabled={isResending}
              style={{
                background: isResending
                  ? "#6c757d"
                  : "linear-gradient(135deg, #0dcaf0, #0bb5d6)",
                border: "none",
                borderRadius: "12px",
                padding: "12px 20px",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s ease",
                boxShadow: isResending
                  ? "none"
                  : "0 4px 15px rgba(13, 202, 240, 0.3)",
                cursor: isResending ? "not-allowed" : "pointer",
              }}
              onMouseOver={(e) => {
                if (!isResending) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 20px rgba(13, 202, 240, 0.4)";
                }
              }}
              onMouseOut={(e) => {
                if (!isResending) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(13, 202, 240, 0.3)";
                }
              }}
            >
              {isResending ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    style={{ width: "16px", height: "16px" }}
                  ></span>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-redo mr-2"></i>
                  Resend Verification Email
                </>
              )}
            </button>

            <button
              className="btn ml-2"
              onClick={onClose}
              style={{
                background: "rgba(108, 117, 125, 0.8)",
                border: "none",
                borderRadius: "12px",
                padding: "12px 20px",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "rgba(108, 117, 125, 1)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "rgba(108, 117, 125, 0.8)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
