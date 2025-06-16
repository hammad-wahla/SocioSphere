import React, { useState, useEffect, useRef } from "react";
import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { useHistory, useParams } from "react-router-dom";
import {
  MESS_TYPES,
  getConversations,
} from "../../redux/actions/messageAction";

const LeftSide = () => {
  const { auth, message, online } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const history = useHistory();
  const { id } = useParams();

  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm) return setSearchUsers([]);

    try {
      setIsSearching(true);
      const res = await getDataAPI(`search?username=${searchTerm}`, auth.token);
      setSearchUsers(res.data.users);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddUser = (user) => {
    setSearch("");
    setSearchUsers([]);
    dispatch({
      type: MESS_TYPES.ADD_USER,
      payload: { ...user, text: "", media: [] },
    });
    dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online });
    return history.push(`/message/${user._id}`);
  };

  const isActive = (user) => {
    if (id === user._id) return "active";
    return "";
  };

  const clearSearch = () => {
    setSearch("");
    setSearchUsers([]);
  };

  // Real-time search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (search.trim()) {
        handleSearch(search.trim());
      } else {
        setSearchUsers([]);
        setIsSearching(false);
      }
    }, 300); // 300ms delay for debouncing

    return () => clearTimeout(delayedSearch);
  }, [search, auth.token, dispatch]);

  useEffect(() => {
    if (message.firstLoad) return;
    dispatch(getConversations({ auth }));
  }, [dispatch, auth, message.firstLoad]);

  // Load More
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, [setPage]);

  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversations({ auth, page }));
    }
  }, [message.resultUsers, page, auth, dispatch]);

  // Check User Online - Offline
  useEffect(() => {
    if (message.firstLoad) {
      dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online });
    }
  }, [online, message.firstLoad, dispatch]);

  return (
    <div className="chat-sidebar-modern">
      {/* Modern Search Header */}
      <div className="chat-sidebar-header">
        <h3 className="sidebar-title">
          <i className="fas fa-comments sidebar-icon"></i>
          Messages
        </h3>

        <form
          className="search-form-modern"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              value={search}
              placeholder="Search conversations..."
              onChange={(e) => setSearch(e.target.value)}
              className="search-input-modern"
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={clearSearch}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Chat List */}
      <div className="chat-list-container">
        {isSearching ? (
          <div className="search-loading">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Searching...</span>
          </div>
        ) : searchUsers.length !== 0 ? (
          <div className="search-results">
            <div className="section-header">
              <span className="section-title">Search Results</span>
              <span className="section-count">{searchUsers.length}</span>
            </div>
            {searchUsers.map((user) => (
              <div
                key={user._id}
                className={`chat-item modern search-result ${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} />
                <div className="chat-item-actions">
                  <i className="fas fa-plus-circle add-chat-icon"></i>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="conversations-list">
            {message.users.length > 0 && (
              <div className="section-header">
                <span className="section-title">Recent Chats</span>
                <span className="section-count">{message.users.length}</span>
              </div>
            )}

            {message.users.length === 0 ? (
              <div className="empty-chat-state">
                <i className="fas fa-comment-dots empty-icon"></i>
                <h4>No conversations yet</h4>
                <p>Start a conversation by searching for people above</p>
              </div>
            ) : (
              message.users.map((user) => (
                <div
                  key={user._id}
                  className={`chat-item modern ${isActive(user)}`}
                  onClick={() => handleAddUser(user)}
                >
                  <div className="chat-item-content">
                    <UserCard user={user} msg={true} />
                  </div>

                  <div className="chat-status">
                    {user.online ? (
                      <div className="online-status online">
                        <i className="fas fa-circle"></i>
                      </div>
                    ) : (
                      auth.user.following.find(
                        (item) => item._id === user._id
                      ) && (
                        <div className="online-status offline">
                          <i className="fas fa-circle"></i>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <button ref={pageEnd} className="load-more-hidden">
          Load More
        </button>
      </div>
    </div>
  );
};

export default LeftSide;
