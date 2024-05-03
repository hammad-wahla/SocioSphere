import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { register } from "../redux/actions/authAction";

const Register = () => {
  const { auth, alert } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const initialState = {
    fullname: "",
    username: "",
    email: "",
    password: "",
    cf_password: "",
    gender: "male",
  };
  const [userData, setUserData] = useState(initialState);
  const { fullname, username, email, password, cf_password } = userData;

  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);

  useEffect(() => {
    if (auth.token) history.push("/");
  }, [auth.token, history]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(userData));
  };

  return (
    <div className=" min-h-screen min-w-screen">
      <div className="auth_page">
        <div className="d-flex border-radius">
          <form className="reg-form" onSubmit={handleSubmit}>
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

            <div className="row">
              <div
                className="form-group col-lg-6 col-md-6 col-12"
                style={{ fontFamily: "times new roman" }}
              >
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  className="form-control inputs"
                  id="fullname"
                  name="fullname"
                  onChange={handleChangeInput}
                  value={fullname}
                  style={{ background: `${alert.fullname ? "#fd2d6a14" : ""}` }}
                />

                <small className="form-text text-danger">
                  {alert.fullname ? alert.fullname : ""}
                </small>
              </div>

              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="username">User Name</label>
                <input
                  type="text"
                  className="form-control inputs"
                  id="username"
                  name="username"
                  onChange={handleChangeInput}
                  value={username.toLowerCase().replace(/ /g, "")}
                  style={{ background: `${alert.username ? "#fd2d6a14" : ""}` }}
                />

                <small className="form-text text-danger">
                  {alert.username ? alert.username : ""}
                </small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control inputs"
                id="exampleInputEmail1"
                name="email"
                onChange={handleChangeInput}
                value={email}
                style={{ background: `${alert.email ? "#fd2d6a14" : ""}` }}
              />

              <small className="form-text text-danger">
                {alert.email ? alert.email : ""}
              </small>
            </div>

            <div className="row">
              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="exampleInputPassword1">Password</label>

                <div className="pass">
                  <input
                    type={typePass ? "text" : "password"}
                    className="form-control inputs"
                    id="exampleInputPassword1"
                    onChange={handleChangeInput}
                    value={password}
                    name="password"
                    style={{
                      background: `${alert.password ? "#fd2d6a14" : ""}`,
                    }}
                  />

                  <small
                    className="mr-2"
                    onClick={() => setTypePass(!typePass)}
                  >
                    {typePass ? "Hide" : "Show"}
                  </small>
                </div>

                <small className="form-text text-danger">
                  {alert.password ? alert.password : ""}
                </small>
              </div>

              <div className="form-group col-lg-6 col-md-6 col-12">
                <label htmlFor="cf_password">Confirm Password</label>

                <div className="pass">
                  <input
                    type={typeCfPass ? "text" : "password"}
                    className="form-control inputs"
                    id="cf_password"
                    onChange={handleChangeInput}
                    value={cf_password}
                    name="cf_password"
                    style={{
                      background: `${alert.cf_password ? "#fd2d6a14" : ""}`,
                    }}
                  />

                  <small
                    className="mr-2"
                    onClick={() => setTypeCfPass(!typeCfPass)}
                  >
                    {typeCfPass ? "Hide" : "Show"}
                  </small>
                </div>

                <small className="form-text text-danger">
                  {alert.cf_password ? alert.cf_password : ""}
                </small>
              </div>
            </div>

            <div className="row justify-content-around mx-0 mb-3">
              <label htmlFor="male">
                Male:{" "}
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  defaultChecked
                  onChange={handleChangeInput}
                />
              </label>

              <label htmlFor="female">
                Female:{" "}
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  onChange={handleChangeInput}
                />
              </label>

              <label htmlFor="other">
                Other:{" "}
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  onChange={handleChangeInput}
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-info text-white mb-3 w-100"
            >
              Register
            </button>

            <center>
              <p className="my-2">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-info"
                  style={{ textDecoration: "none", fontWeight: "bold" }}
                >
                  Login
                </Link>
              </p>
            </center>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
