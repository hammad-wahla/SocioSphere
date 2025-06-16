import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserCard from "../../components/UserCard";
import Avatar from "../Avatar";

const LeftSideBar = () => {
  // Get the list of friends from the Redux store
  const { auth } = useSelector((state) => state);
  const friends = auth.user.following;

  return (
    <>
      <div className=" LeftSide">
        <UserCard user={auth.user} />
      </div>

      {/* Follow Requests Section - Only show when there are requests */}
      {auth.user.followRequests && auth.user.followRequests.length > 0 && (
        <div className="mt-2 LeftSide">
          <Link to="/follow-requests" className="follow-requests-link">
            <div className="follow-requests-sidebar-item">
              <i className="fas fa-user-plus text-info"></i>
              <span className="follow-requests-text">Follow Requests</span>
              <span className="follow-requests-count">
                {auth.user.followRequests.length}
              </span>
            </div>
          </Link>
        </div>
      )}
      <div className="mt-2   LeftSide">
        <h5>
          <i className="fas fa-user-friends mr-2 text-info"></i>
          Your Connections
        </h5>
        <hr />
        {/* Display friends */}
        <div className="connections-list">
          {friends && friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend._id} className="user-card">
                <UserCard user={friend} />
              </div>
            ))
          ) : (
            <div className="text-center py-3">
              <i className="fas fa-user-plus fa-2x text-muted mb-3"></i>
              <p className="text-muted mb-1">No connections yet</p>
              <small className="text-muted">
                Start following people to see them here
              </small>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LeftSideBar;
