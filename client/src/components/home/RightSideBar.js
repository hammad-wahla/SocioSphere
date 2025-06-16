import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSuggestions } from "../../redux/actions/suggestionsAction";

import UserCard from "../UserCard";
import LoadingSpinner from "../LoadingSpinner";
import FollowBtn from "../FollowBtn";

const RightSideBar = () => {
  const { auth, suggestions } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div className="mt-2 LeftSide">
      <div className="d-flex justify-content-between align-items-center">
        <h5>
          <i className="fas fa-users mr-2 text-info"></i>
          Suggestions for you
        </h5>
        {!suggestions.loading && (
          <i
            className="fas fa-redo"
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(getSuggestions(auth.token))}
          />
        )}
      </div>
      <hr />
      {/* Display suggestions */}
      <div className="connections-list">
        {suggestions.loading ? (
          <LoadingSpinner
            type="dots"
            text="Finding suggestions..."
            size="small"
          />
        ) : suggestions.users && suggestions.users.length > 0 ? (
          suggestions.users.map((user) => (
            <div key={user._id} className="user-card">
              <UserCard user={user} />
              <div className="follow-icon-corner">
                <FollowBtn user={user} iconOnly={true} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-3">
            <i className="fas fa-user-plus fa-2x text-muted mb-3"></i>
            <p className="text-muted mb-1">No suggestions available</p>
            <small className="text-muted">
              Try following more people to get better suggestions
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSideBar;
