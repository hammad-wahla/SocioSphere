import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteAllNotifies, isReadNotify } from "../redux/actions/notifyAction";
import NotifyModal from "../components/NotifyModal";
import LoadingSpinner from "../components/LoadingSpinner";

const Notifications = () => {
  const { auth, notify } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    // Mark notifications as read when viewing the page
    const unreadNotifications = notify.data.filter(item => !item.isRead);
    unreadNotifications.forEach(msg => {
      dispatch(isReadNotify({ msg, auth }));
    });
  }, [notify.data, auth, dispatch]);

  if (!auth.token) {
    return (
      <div className="notifications-page">
        <div style={{ 
          minHeight: '80vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notifications</h2>
        {notify.data.length > 0 && (
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => dispatch(deleteAllNotifies(auth.token))}
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="notifications-container">
        <NotifyModal showHeader={false} />
      </div>
    </div>
  );
};

export default Notifications;