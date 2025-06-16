import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { follow, unfollow, cancelFollowRequest } from "../redux/actions/profileAction";

const FollowBtn = ({ user, iconOnly = false }) => {
  const [followed, setFollowed] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const { auth, profile, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (auth.user.following.find((item) => item._id === user._id)) {
      setFollowed(true);
    } else if (
      auth.user.pendingRequests &&
      auth.user.pendingRequests.includes(user._id)
    ) {
      setRequestSent(true);
    }
    return () => {
      setFollowed(false);
      setRequestSent(false);
    };
  }, [auth.user.following, auth.user.pendingRequests, user._id]);

  const handleFollow = async () => {
    if (load) return;

    setLoad(true);
    const result = await dispatch(
      follow({ users: profile.users, user, auth, socket })
    );

    // Check if it was a follow request or actual follow
    if (user.isPrivate && !followed) {
      setRequestSent(true);
    } else {
      setFollowed(true);
    }

    setLoad(false);
  };

  const handleUnFollow = async () => {
    if (load) return;

    setFollowed(false);
    setLoad(true);
    await dispatch(unfollow({ users: profile.users, user, auth, socket }));
    setLoad(false);
  };

  const handleCancelRequest = async () => {
    if (load) return;

    setLoad(true);
    await dispatch(cancelFollowRequest({ users: profile.users, user, auth, socket }));
    setRequestSent(false);
    setLoad(false);
  };

  if (iconOnly) {
    return (
      <button
        className={`btn-unified btn-icon btn-sm ${
          followed
            ? "btn-outline-danger following"
            : requestSent
            ? "btn-outline-warning requested"
            : "btn-primary"
        } ${load ? "btn-loading" : ""}`}
        onClick={
          followed 
            ? handleUnFollow 
            : requestSent 
            ? handleCancelRequest 
            : handleFollow
        }
        disabled={load}
        title={
          load
            ? "Loading..."
            : followed
            ? "Unfollow"
            : requestSent
            ? "Cancel Request"
            : "Follow"
        }
      >
        {!load && (
          <i
            className={
              followed
                ? "fas fa-user-check"
                : requestSent
                ? "fas fa-clock"
                : "fas fa-user-plus"
            }
          />
        )}
      </button>
    );
  }

  return (
    <>
      {followed ? (
        <button
          className={`btn-unified btn-outline-danger btn-sm btn-follow following ${
            load ? "btn-loading" : ""
          }`}
          onClick={handleUnFollow}
          disabled={load}
        >
          {!load && <i className="fas fa-user-minus"></i>}
          Unfollow
        </button>
      ) : requestSent ? (
        <button
          className={`btn-unified btn-outline-warning btn-sm btn-follow requested ${
            load ? "btn-loading" : ""
          }`}
          onClick={handleCancelRequest}
          disabled={load}
          title="Click to cancel request"
        >
          {!load && <i className="fas fa-clock"></i>}
          Cancel Request
        </button>
      ) : (
        <button
          className={`btn-unified btn-primary btn-sm btn-follow ${
            load ? "btn-loading" : ""
          }`}
          onClick={handleFollow}
          disabled={load}
        >
          {!load && <i className="fas fa-user-plus"></i>}
          {user.isPrivate ? "Request" : "Follow"}
        </button>
      )}
    </>
  );
};

export default FollowBtn;
