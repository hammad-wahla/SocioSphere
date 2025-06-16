import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkImage } from "../../utils/imageUpload";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { updateProfileUser } from "../../redux/actions/profileAction";
import { getDataAPI } from "../../utils/fetchData";

const EditProfile = ({ setOnEdit }) => {
  const initState = {
    fullname: "",
    username: "",
    story: "",
    gender: "",
  };
  const [userData, setUserData] = useState(initState);
  const { fullname, username, story, gender } = userData;

  const [avatar, setAvatar] = useState("");
  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: null,
    message: "",
  });
  const [originalUsername, setOriginalUsername] = useState("");
  const [usernameTimeout, setUsernameTimeout] = useState(null);

  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData(auth.user);
    setOriginalUsername(auth.user.username);
  }, [auth.user]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (usernameTimeout) {
        clearTimeout(usernameTimeout);
      }
    };
  }, [usernameTimeout]);

  const changeAvatar = (e) => {
    const file = e.target.files[0];

    const err = checkImage(file);
    if (err)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err },
      });

    setAvatar(file);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    // Real-time username checking with debounce
    if (name === "username") {
      // Clear existing timeout
      if (usernameTimeout) {
        clearTimeout(usernameTimeout);
      }

      // Set new timeout for debounced checking
      const timeout = setTimeout(() => {
        handleUsernameCheck(value);
      }, 500);

      setUsernameTimeout(timeout);
    }
  };

  const handleUsernameCheck = async (usernameValue) => {
    // Reset if empty or same as original
    if (!usernameValue || usernameValue === originalUsername) {
      setUsernameStatus({ checking: false, available: null, message: "" });
      return;
    }

    // Basic validation
    if (usernameValue.length < 3) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "Username must be at least 3 characters",
      });
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(usernameValue)) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "Username can only contain letters, numbers, and underscores",
      });
      return;
    }

    setUsernameStatus({
      checking: true,
      available: null,
      message: "Checking availability...",
    });

    try {
      // Use the search endpoint to check for username availability
      const res = await getDataAPI(
        `search?username=${usernameValue}`,
        auth.token
      );

      // Check if any user has the exact username
      const exactMatch = res.data.users.find(
        (user) => user.username.toLowerCase() === usernameValue.toLowerCase()
      );

      if (exactMatch) {
        setUsernameStatus({
          checking: false,
          available: false,
          message: "Username is already taken",
        });
      } else {
        setUsernameStatus({
          checking: false,
          available: true,
          message: "Username is available!",
        });
      }
    } catch (err) {
      console.error("Username check error:", err);
      // If there's an error, assume username is available
      setUsernameStatus({
        checking: false,
        available: true,
        message: "Username appears available",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if username is available before submitting
    if (username !== originalUsername && !usernameStatus.available) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Please choose an available username" },
      });
      return;
    }

    dispatch(updateProfileUser({ userData, avatar, auth }));
  };

  const getUsernameStatusIcon = () => {
    if (usernameStatus.checking)
      return <i className="fas fa-spinner fa-spin text-info"></i>;
    if (usernameStatus.available === true)
      return <i className="fas fa-check-circle text-success"></i>;
    if (usernameStatus.available === false)
      return <i className="fas fa-times-circle text-danger"></i>;
    return null;
  };

  const getUsernameStatusClass = () => {
    if (usernameStatus.available === true) return "success";
    if (usernameStatus.available === false) return "error";
    return "";
  };

  return (
    <div className="edit_profile_overlay">
      <div className="edit_profile_modal">
        <div className="modal_header">
          <h4>Edit Profile</h4>
          <button
            className="close_btn"
            onClick={() => setOnEdit(false)}
            type="button"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal_content">
          <div className="avatar_section">
            <div className="info_avatar">
              <img
                src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
                alt="avatar"
              />
              <div className="avatar_overlay">
                <i className="fas fa-camera" />
                <span>Change Photo</span>
                <input
                  type="file"
                  name="file"
                  id="file_up"
                  accept="image/*"
                  onChange={changeAvatar}
                />
              </div>
            </div>
          </div>

          <div className="form_sections">
            <div className="form_row">
              <div className="form_group">
                <label htmlFor="fullname">
                  <i className="fas fa-user me-2"></i>
                  Full Name
                </label>
                <div className="input_wrapper">
                  <input
                    type="text"
                    className="form_input"
                    id="fullname"
                    name="fullname"
                    value={fullname}
                    onChange={handleInput}
                    maxLength="25"
                    placeholder="Enter your full name"
                    required
                  />
                  <small className="char_count">
                    {fullname ? fullname.length : 0}/25
                  </small>
                </div>
              </div>

              <div className="form_group">
                <label htmlFor="username">
                  <i className="fas fa-at me-2"></i>
                  Username
                </label>
                <div
                  className={`input_wrapper username_wrapper ${getUsernameStatusClass()}`}
                >
                  <input
                    type="text"
                    name="username"
                    value={username}
                    className="form_input username_input"
                    onChange={handleInput}
                    placeholder="Choose a unique username"
                    maxLength="20"
                    required
                  />
                  <div className="username_status">
                    {getUsernameStatusIcon()}
                  </div>
                  {usernameStatus.message && (
                    <small
                      className={`username_message ${getUsernameStatusClass()}`}
                    >
                      {usernameStatus.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="form_group full_width">
              <label htmlFor="story">
                <i className="fas fa-quote-left me-2"></i>
                Bio/Story
              </label>
              <div className="input_wrapper">
                <textarea
                  name="story"
                  value={story}
                  cols="30"
                  rows="4"
                  className="form_textarea"
                  onChange={handleInput}
                  maxLength="200"
                  placeholder="Tell people about yourself..."
                />
                <small className="char_count">
                  {story ? story.length : 0}/200
                </small>
              </div>
            </div>

            <div className="form_group">
              <label htmlFor="gender">
                <i className="fas fa-venus-mars me-2"></i>
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={gender}
                className="form_select"
                onChange={handleInput}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="modal_footer">
            <button
              type="button"
              className="btn_cancel"
              onClick={() => setOnEdit(false)}
            >
              Cancel
            </button>
            <button
              className="btn_save"
              type="submit"
              disabled={
                username !== originalUsername && !usernameStatus.available
              }
            >
              <i className="fas fa-save me-2"></i>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
