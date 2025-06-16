import React, { useState, useEffect } from "react";
import Avatar from "../Avatar";
import EditProfile from "./EditProfile";
import FollowBtn from "../FollowBtn";
import FollowRequestButtons from "../FollowRequestButtons";
import Followers from "./Followers";
import Following from "./Following";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

const Info = ({ id, auth, profile, dispatch }) => {
  const [userData, setUserData] = useState([]);
  const [onEdit, setOnEdit] = useState(false);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const newData = profile.users.filter((user) => user._id === id);
      setUserData(newData);
    }
  }, [id, auth, dispatch, profile.users]);

  useEffect(() => {
    if (showFollowers || showFollowing || onEdit) {
      dispatch({ type: GLOBALTYPES.MODAL, payload: true });
    } else {
      dispatch({ type: GLOBALTYPES.MODAL, payload: false });
    }
  }, [showFollowers, showFollowing, onEdit, dispatch]);

  // Helper function to get post count safely
  const getUserPostCount = (userId) => {
    if (!profile.posts || !Array.isArray(profile.posts)) return 0;

    // Find the user's post data object
    const userPostData = profile.posts.find(
      (postData) => postData._id === userId
    );

    if (!userPostData || !userPostData.posts) return 0;

    return userPostData.posts.length;
  };

  // Helper function to get creation year safely
  const getMemberSince = (createdAt) => {
    if (!createdAt) return new Date().getFullYear();
    return new Date(createdAt).getFullYear();
  };

  return (
    <div className="profile_info_modern">
      {userData.map((user) => (
        <div className="profile_header" key={user._id}>
          {/* Cover Section */}
          <div className="profile_cover">
            <div className="cover_gradient"></div>
          </div>

          {/* Main Profile Content */}
          <div className="profile_main">
            {/* Avatar Section */}
            <div className="profile_avatar_section">
              <div className="avatar_container">
                <Avatar src={user.avatar} size="profile-avatar" />
                <div className="avatar_status"></div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="profile_content">
              <div className="profile_header_info">
                <div className="name_section">
                  <h1 className="username">@{user.username || "username"}</h1>
                  <h2 className="fullname">{user.fullname || "Full Name"}</h2>
                </div>

                <div className="action_section">
                  {user._id === auth.user._id ? (
                    <button
                      className="edit_profile_btn"
                      onClick={() => setOnEdit(true)}
                    >
                      <i className="fas fa-edit"></i>
                      Edit Profile
                    </button>
                  ) : (
                    <FollowBtn user={user} />
                  )}
                </div>
              </div>

              {/* Follow Request Buttons - Show when viewing someone who sent you a follow request */}
              {user._id !== auth.user._id && (
                <FollowRequestButtons user={user} />
              )}

              {/* Profile Stats */}
              <div className="profile_stats">
                <div
                  className="stat_item"
                  onClick={() => setShowFollowers(true)}
                >
                  <span className="stat_number">
                    {user.followers ? user.followers.length : 0}
                  </span>
                  <span className="stat_label">Followers</span>
                </div>

                <div className="stat_divider"></div>

                <div
                  className="stat_item"
                  onClick={() => setShowFollowing(true)}
                >
                  <span className="stat_number">
                    {user.following ? user.following.length : 0}
                  </span>
                  <span className="stat_label">Following</span>
                </div>

                <div className="stat_divider"></div>

                <div className="stat_item">
                  <span className="stat_number">
                    {getUserPostCount(user._id)}
                  </span>
                  <span className="stat_label">Posts</span>
                </div>
              </div>

              {/* Bio Section */}
              {user.story && (
                <div className="profile_bio">
                  <p>{user.story}</p>
                </div>
              )}

              {/* Profile Badges */}
              <div className="profile_badges">
                <span className="badge verified_badge">
                  <i className="fas fa-check-circle"></i>
                  Verified
                </span>
                <span className="badge member_badge">
                  <i className="fas fa-calendar-alt"></i>
                  Member since {getMemberSince(user.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {onEdit && <EditProfile setOnEdit={setOnEdit} />}

          {showFollowers && (
            <Followers
              users={user.followers || []}
              setShowFollowers={setShowFollowers}
            />
          )}
          {showFollowing && (
            <Following
              users={user.following || []}
              setShowFollowing={setShowFollowing}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Info;
