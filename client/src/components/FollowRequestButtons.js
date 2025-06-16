import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  acceptFollowRequest,
  rejectFollowRequest,
} from "../redux/actions/profileAction";
import { showToast } from "../utils/confirmDialog";

const FollowRequestButtons = ({ user }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Check if this user has sent a follow request to the current user
  const hasRequestFromUser =
    auth.user.followRequests &&
    auth.user.followRequests.some((request) =>
      typeof request === "string"
        ? request === user._id
        : request._id === user._id
    );

  if (!hasRequestFromUser) {
    return null; // Don't show buttons if no request from this user
  }

  const handleAccept = async () => {
    setLoading(true);
    try {
      await dispatch(
        acceptFollowRequest({
          requesterId: user._id,
          auth,
          socket,
        })
      );
      showToast(dispatch, {
        type: "success",
        message: `You are now following ${user.fullname}`,
      });
    } catch (error) {
      showToast(dispatch, {
        type: "error",
        message: "Failed to accept follow request",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await dispatch(
        rejectFollowRequest({
          requesterId: user._id,
          auth,
        })
      );
      showToast(dispatch, {
        type: "success",
        message: "Follow request rejected",
      });
    } catch (error) {
      showToast(dispatch, {
        type: "error",
        message: "Failed to reject follow request",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="follow-request-buttons">
      <div className="follow-request-indicator">
        <i className="fas fa-user-plus text-info"></i>
        <span className="follow-request-text">
          <strong>{user.fullname}</strong> wants to follow you
        </span>
      </div>

      <div className="follow-request-actions">
        <button
          className={`btn-unified btn-success btn-sm ${
            loading ? "btn-loading" : ""
          }`}
          onClick={handleAccept}
          disabled={loading}
        >
          {!loading && <i className="fas fa-check"></i>}
          Accept
        </button>

        <button
          className={`btn-unified btn-outline-secondary btn-sm ${
            loading ? "btn-loading" : ""
          }`}
          onClick={handleReject}
          disabled={loading}
        >
          {!loading && <i className="fas fa-times"></i>}
          Reject
        </button>
      </div>
    </div>
  );
};

export default FollowRequestButtons;
