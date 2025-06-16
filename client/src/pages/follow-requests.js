import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../utils/fetchData";
import {
  acceptFollowRequest,
  rejectFollowRequest,
} from "../redux/actions/profileAction";
import { showToast } from "../utils/confirmDialog";
import Avatar from "../components/Avatar";
import { Link } from "react-router-dom";

const FollowRequests = () => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [followRequests, setFollowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchFollowRequests();
  }, [auth.token]);

  const fetchFollowRequests = async () => {
    try {
      setLoading(true);
      const res = await getDataAPI("follow-requests", auth.token);
      setFollowRequests(res.data.followRequests || []);
    } catch (error) {
      showToast(dispatch, {
        type: "error",
        message: "Failed to load follow requests",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requesterId, requesterName) => {
    setActionLoading({ ...actionLoading, [requesterId]: "accepting" });
    try {
      await dispatch(
        acceptFollowRequest({
          requesterId,
          auth,
          socket,
        })
      );

      // Remove from local state
      setFollowRequests((prev) =>
        prev.filter((req) => req._id !== requesterId)
      );

      showToast(dispatch, {
        type: "success",
        message: `You are now following ${requesterName}`,
      });
    } catch (error) {
      showToast(dispatch, {
        type: "error",
        message: "Failed to accept follow request",
      });
    } finally {
      setActionLoading({ ...actionLoading, [requesterId]: null });
    }
  };

  const handleReject = async (requesterId, requesterName) => {
    setActionLoading({ ...actionLoading, [requesterId]: "rejecting" });
    try {
      await dispatch(
        rejectFollowRequest({
          requesterId,
          auth,
        })
      );

      // Remove from local state
      setFollowRequests((prev) =>
        prev.filter((req) => req._id !== requesterId)
      );

      showToast(dispatch, {
        type: "success",
        message: `Follow request from ${requesterName} rejected`,
      });
    } catch (error) {
      showToast(dispatch, {
        type: "error",
        message: "Failed to reject follow request",
      });
    } finally {
      setActionLoading({ ...actionLoading, [requesterId]: null });
    }
  };

  if (loading) {
    return (
      <div className="follow-requests-page">
        <div className="follow-requests-container">
          <div className="follow-requests-loading">
            <div className="loading-spinner"></div>
            <p>Loading follow requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="follow-requests-page">
      <div className="follow-requests-container">
        <div className="follow-requests-header">
          <h2>
            <i className="fas fa-user-plus"></i>
            Follow Requests
          </h2>
          <p>Manage people who want to follow you</p>
        </div>

        {followRequests.length === 0 ? (
          <div className="follow-requests-empty">
            <i className="fas fa-user-friends"></i>
            <h3>No follow requests</h3>
            <p>When people request to follow you, they'll appear here.</p>
          </div>
        ) : (
          <div className="follow-requests-list">
            {followRequests.map((requester) => (
              <div key={requester._id} className="follow-request-item">
                <div className="request-user-info">
                  <Link
                    to={`/profile/${requester._id}`}
                    className="request-avatar-link"
                  >
                    <Avatar src={requester.avatar} size="medium-avatar" />
                  </Link>

                  <div className="request-user-details">
                    <Link
                      to={`/profile/${requester._id}`}
                      className="request-name-link"
                    >
                      <h4>{requester.fullname}</h4>
                      <p>@{requester.username}</p>
                    </Link>
                  </div>
                </div>

                <div className="request-actions">
                  <button
                    className={`btn-unified btn-success btn-sm ${
                      actionLoading[requester._id] === "accepting"
                        ? "btn-loading"
                        : ""
                    }`}
                    onClick={() =>
                      handleAccept(requester._id, requester.fullname)
                    }
                    disabled={actionLoading[requester._id]}
                  >
                    {actionLoading[requester._id] !== "accepting" && (
                      <i className="fas fa-check"></i>
                    )}
                    Accept
                  </button>

                  <button
                    className={`btn-unified btn-outline-secondary btn-sm ${
                      actionLoading[requester._id] === "rejecting"
                        ? "btn-loading"
                        : ""
                    }`}
                    onClick={() =>
                      handleReject(requester._id, requester.fullname)
                    }
                    disabled={actionLoading[requester._id]}
                  >
                    {actionLoading[requester._id] !== "rejecting" && (
                      <i className="fas fa-times"></i>
                    )}
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowRequests;
