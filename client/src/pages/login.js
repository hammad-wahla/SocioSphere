import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { login } from "../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import EmailVerificationNotice from "../components/EmailVerificationNotice";

const Login = () => {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;

  const [typePass, setTypePass] = useState(false);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const { auth, alert } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (auth.token) history.push("/");
  }, [auth.token, history]);

  // Check if alert contains email verification info
  useEffect(() => {
    if (alert.needsVerification && alert.email) {
      setShowVerificationNotice(true);
      setVerificationEmail(alert.email);
    }
  }, [alert]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData));
  };

  const handleCloseVerificationNotice = () => {
    setShowVerificationNotice(false);
    setVerificationEmail("");
  };

  return (
    <>
      <div className=" min-h-screen min-w-screen">
        <div className="auth_page">
          <div className="d-flex border-radius">
            <form className="form mt-3" onSubmit={handleSubmit}>
              <h3
                className="text-uppercase d-flex  justify-content-center text-center text-white bg-info mb-4"
                style={{
                  height: "80px",
                  alignItems: "center",
                  borderRadius: "10px",
                  fontFamily: "cursive",
                }}
              >
                <img
                  style={{ borderRadius: "50%" }}
                  src="/sociologowhite.png"
                  width={50}
                  height={50}
                />
                SocioSphere
              </h3>
              <hr />

              <div className="form-group font">
                <label className="font" htmlFor="exampleInputEmail1">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control inputs"
                  id="exampleInputEmail1"
                  name="email"
                  aria-describedby="emailHelp"
                  onChange={handleChangeInput}
                  value={email}
                />

                <small id="emailHelp" className="form-text font text-muted">
                  We'll never share your email with anyone else.
                </small>
              </div>

              <div className="form-group font">
                <label className="font" htmlFor="exampleInputPassword1">
                  Password
                </label>

                <div className="pass">
                  <input
                    type={typePass ? "text" : "password"}
                    className="form-control inputs"
                    id="exampleInputPassword1"
                    onChange={handleChangeInput}
                    value={password}
                    name="password"
                  />

                  {password && (
                    <small
                      className="mr-2"
                      onClick={() => setTypePass(!typePass)}
                    >
                      {typePass ? "Hide" : "Show"}
                    </small>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-info text-white w-100 font mt-2 mb-3"
                disabled={email && password ? false : true}
              >
                Login
              </button>

              <center>
                <p className=" font">
                  You don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-info"
                    style={{ textDecoration: "none", fontWeight: "bold" }}
                  >
                    Sign Up
                  </Link>
                </p>
              </center>
            </form>
          </div>
        </div>
      </div>

      {/* Email Verification Notice Modal */}
      {showVerificationNotice && (
        <EmailVerificationNotice
          email={verificationEmail}
          onClose={handleCloseVerificationNotice}
        />
      )}
    </>
  );
};

export default Login;
