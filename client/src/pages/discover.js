import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDiscoverPosts,
  DISCOVER_TYPES,
} from "../redux/actions/discoverAction";
import PostThumb from "../components/PostThumb";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadMoreBtn from "../components/LoadMoreBtn";
import { getDataAPI } from "../utils/fetchData";

const Discover = () => {
  const { auth, discover } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!discover.firstLoad) {
      dispatch(getDiscoverPosts(auth.token));
    }
  }, [dispatch, auth.token, discover.firstLoad]);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(
      `post_discover?num=${discover.page * 9}`,
      auth.token
    );
    dispatch({ type: DISCOVER_TYPES.UPDATE_POST, payload: res.data });
    setLoad(false);
  };

  const handleRefresh = () => {
    dispatch({ type: DISCOVER_TYPES.LOADING, payload: true });
    dispatch(getDiscoverPosts(auth.token));
  };

  // Safety check for discover.posts
  const posts = discover.posts || [];
  const result = discover.result || 0;
  const page = discover.page || 0;

  return (
    <div className="discover-page">
      {/* Header */}
      <div className="discover-header">
        <div className="discover-title-section">
          <div className="discover-icon-wrapper">
            <i className="fas fa-compass discover-main-icon"></i>
          </div>
          <div className="discover-title-content">
            <h2 className="discover-title">Discover</h2>
            <p className="discover-subtitle">
              Posts from people you haven't followed yet
            </p>
          </div>
        </div>
        <button
          className="discover-refresh-btn"
          onClick={handleRefresh}
          disabled={discover.loading}
        >
          <i
            className={`fas fa-sync-alt ${discover.loading ? "fa-spin" : ""}`}
          ></i>
        </button>
      </div>


      {/* Content */}
      <div className="discover-content">
        {discover.loading ? (
          <div className="discover-loading-state">
            <div className="loading-animation">
              <LoadingSpinner type="pulse" size="large" />
            </div>
            <p className="loading-text">Finding new posts for you...</p>
          </div>
        ) : result === 0 ? (
          <div className="discover-empty-state">
            <div className="empty-state-visual">
              <div className="empty-icon-container">
                <i className="fas fa-search empty-main-icon"></i>
                <div className="empty-icon-decoration"></div>
              </div>
            </div>

            <div className="empty-state-content">
              <h3 className="empty-title">No new posts to discover</h3>
              <p className="empty-description">
                You've seen all the latest posts from people you haven't
                followed yet. Check back later for fresh content!
              </p>

              <div className="empty-actions">
                <button
                  className="empty-action-btn primary"
                  onClick={handleRefresh}
                >
                  <i className="fas fa-redo mr-2"></i>
                  Refresh Posts
                </button>
              </div>
            </div>
          </div>
        ) : (
          <PostThumb posts={posts} result={result} />
        )}

        {load && (
          <div className="discover-load-more-loading">
            <LoadingSpinner
              type="dots"
              text="Loading more posts..."
              size="small"
            />
          </div>
        )}

        {!discover.loading && result > 0 && (
          <LoadMoreBtn
            result={result}
            page={page}
            load={load}
            handleLoadMore={handleLoadMore}
          />
        )}
      </div>
    </div>
  );
};

export default Discover;
