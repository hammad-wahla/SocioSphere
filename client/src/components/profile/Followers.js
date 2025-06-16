import React from "react";
import UserCard from "../UserCard";
import FollowBtn from "../FollowBtn";
import { useSelector } from "react-redux";

const Followers = ({ users, setShowFollowers }) => {
  const { auth } = useSelector((state) => state);

  return (
    <div className="follow-modal-overlay">
      <div className="follow-modal-container">
        {/* Header */}
        <div className="follow-modal-header">
          <div className="follow-header-content">
            <i className="fas fa-users follow-header-icon"></i>
            <h4 className="follow-modal-title">Followers</h4>
            <span className="follow-count-badge">{users.length}</span>
          </div>
          <button
            className="follow-close-btn"
            onClick={() => setShowFollowers(false)}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="follow-modal-body">
          {users.length === 0 ? (
            <div className="follow-empty-state">
              <i className="fas fa-heart follow-empty-icon"></i>
              <h6 className="follow-empty-title">No Followers Yet</h6>
              <p className="follow-empty-text">
                Share great content to attract followers
              </p>
            </div>
          ) : (
            <div className="follow-users-list">
              {users.map((user) => (
                <div key={user._id} className="follow-user-item">
                  <UserCard
                    user={user}
                    setShowFollowers={setShowFollowers}
                    className="follow-user-card"
                  >
                    {auth.user._id !== user._id && <FollowBtn user={user} />}
                  </UserCard>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Followers;
