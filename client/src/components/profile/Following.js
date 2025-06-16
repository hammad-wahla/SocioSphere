import React from "react";
import UserCard from "../UserCard";
import FollowBtn from "../FollowBtn";
import { useSelector } from "react-redux";

const Following = ({ users, setShowFollowing }) => {
  const { auth } = useSelector((state) => state);

  return (
    <div className="follow-modal-overlay">
      <div className="follow-modal-container">
        {/* Header */}
        <div className="follow-modal-header">
          <div className="follow-header-content">
            <i className="fas fa-user-friends follow-header-icon"></i>
            <h4 className="follow-modal-title">Following</h4>
            <span className="follow-count-badge">{users.length}</span>
          </div>
          <button
            className="follow-close-btn"
            onClick={() => setShowFollowing(false)}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="follow-modal-body">
          {users.length === 0 ? (
            <div className="follow-empty-state">
              <i className="fas fa-user-plus follow-empty-icon"></i>
              <h6 className="follow-empty-title">No Following Yet</h6>
              <p className="follow-empty-text">
                Start following people to see them here
              </p>
            </div>
          ) : (
            <div className="follow-users-list">
              {users.map((user) => (
                <div key={user._id} className="follow-user-item">
                  <UserCard
                    user={user}
                    setShowFollowing={setShowFollowing}
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

export default Following;
