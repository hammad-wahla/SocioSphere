import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { getDataAPI } from "../utils/fetchData";

const VerifyEmail = () => {
  const { token } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        console.log("Attempting to verify email with token:", token);
        console.log("API call URL:", `verify-email/${token}`);

        const res = await getDataAPI(`verify-email/${token}`);
        console.log("Verification API response:", res.data);

        if (res.data.access_token) {
          console.log("Verification successful, logging in user");
          localStorage.setItem("firstLogin", true);
          dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
              token: res.data.access_token,
              user: res.data.user,
            },
          });

          setStatus("success");
          setMessage(res.data.msg);

          // Redirect to home after 3 seconds
          setTimeout(() => {
            history.push("/");
          }, 3000);
        } else {
          console.log("No access token in response");
          setStatus("error");
          setMessage("Verification response did not include login token");
        }
      } catch (err) {
        console.error("Email verification error:", err);
        console.error("Error response:", err.response?.data);
        setStatus("error");
        setMessage(err.response?.data?.msg || "Email verification failed");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      console.error("No token provided in URL");
      setStatus("error");
      setMessage("Invalid verification link");
      setLoading(false);
    }
  }, [token, dispatch, history]);

  const handleGoToLogin = () => {
    history.push("/");
  };

  return (
    <div className="auth_page">
      <div className="auth_box">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0dcaf0, #0bb5d6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
              boxShadow: "0 8px 25px rgba(13, 202, 240, 0.3)",
            }}
          >
            <i className="fas fa-shield-alt fa-2x text-white"></i>
          </div>
          <h3
            style={{
              color: "#2c3e50",
              fontWeight: "700",
              fontSize: "28px",
              marginBottom: "8px",
              letterSpacing: "0.5px",
            }}
          >
            Email Verification
          </h3>
          <p
            style={{
              color: "#6c757d",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Verifying your account security
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(13, 202, 240, 0.1), rgba(13, 202, 240, 0.05))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 25px auto",
                boxShadow: "0 8px 25px rgba(13, 202, 240, 0.2)",
              }}
            >
              <div
                className="spinner-border"
                role="status"
                style={{
                  color: "#0dcaf0",
                  width: "30px",
                  height: "30px",
                }}
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
            <h4
              style={{
                color: "#495057",
                fontWeight: "600",
                fontSize: "20px",
                marginBottom: "15px",
              }}
            >
              Verifying your email...
            </h4>
            <p
              style={{
                color: "#6c757d",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              Please wait while we verify your account
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            {status === "success" ? (
              <>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 25px auto",
                    boxShadow: "0 8px 25px rgba(40, 167, 69, 0.2)",
                  }}
                >
                  <i
                    className="fas fa-check-circle fa-3x"
                    style={{ color: "#28a745" }}
                  ></i>
                </div>

                <h4
                  style={{
                    color: "#28a745",
                    fontWeight: "700",
                    fontSize: "24px",
                    marginBottom: "20px",
                  }}
                >
                  🎉 Verification Successful!
                </h4>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(40, 167, 69, 0.08), rgba(40, 167, 69, 0.04))",
                    padding: "20px",
                    borderRadius: "15px",
                    border: "1px solid rgba(40, 167, 69, 0.2)",
                    marginBottom: "25px",
                  }}
                >
                  <p
                    style={{
                      color: "#495057",
                      fontSize: "16px",
                      lineHeight: "1.6",
                      margin: "0 0 10px 0",
                    }}
                  >
                    {message}
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(248, 249, 250, 0.8)",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      className="spinner-border spinner-border-sm mr-2"
                      style={{
                        color: "#0dcaf0",
                        width: "20px",
                        height: "20px",
                      }}
                    ></div>
                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "15px",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      Redirecting to your dashboard...
                    </p>
                  </div>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "13px",
                      margin: 0,
                    }}
                  >
                    You will be automatically redirected in a few seconds
                  </p>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 25px auto",
                    boxShadow: "0 8px 25px rgba(220, 53, 69, 0.2)",
                  }}
                >
                  <i
                    className="fas fa-times-circle fa-3x"
                    style={{ color: "#dc3545" }}
                  ></i>
                </div>

                <h4
                  style={{
                    color: "#dc3545",
                    fontWeight: "700",
                    fontSize: "24px",
                    marginBottom: "20px",
                  }}
                >
                  Verification Failed
                </h4>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(220, 53, 69, 0.08), rgba(220, 53, 69, 0.04))",
                    padding: "20px",
                    borderRadius: "15px",
                    border: "1px solid rgba(220, 53, 69, 0.2)",
                    marginBottom: "25px",
                  }}
                >
                  <p
                    style={{
                      color: "#495057",
                      fontSize: "16px",
                      lineHeight: "1.6",
                      margin: "0 0 15px 0",
                    }}
                  >
                    {message}
                  </p>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "13px",
                      margin: 0,
                      fontFamily: "monospace",
                      background: "rgba(248, 249, 250, 0.8)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      wordBreak: "break-all",
                    }}
                  >
                    <strong>Debug Info:</strong> Token = {token}
                  </p>
                </div>

                <button
                  className="btn"
                  onClick={handleGoToLogin}
                  style={{
                    background: "linear-gradient(135deg, #0dcaf0, #0bb5d6)",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 30px",
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "15px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(13, 202, 240, 0.3)",
                    letterSpacing: "0.5px",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 6px 20px rgba(13, 202, 240, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 15px rgba(13, 202, 240, 0.3)";
                  }}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Go to Login
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
