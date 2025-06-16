import React, { useEffect, useState } from "react";

import Info from "../../components/profile/Info";
import Posts from "../../components/profile/Posts";
import Saved from "../../components/profile/Saved";
import LoadingSpinner from "../../components/LoadingSpinner";
import UserCard from "../../components/UserCard";
import FollowBtn from "../../components/FollowBtn";

import { useSelector, useDispatch } from "react-redux";
import { getProfileUsers } from "../../redux/actions/profileAction";
import { getSuggestions } from "../../redux/actions/suggestionsAction";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { profile, auth, suggestions } = useSelector((state) => state);
  const dispatch = useDispatch();

  const { id } = useParams();
  const [saveTab, setSaveTab] = useState(false);

  useEffect(() => {
    if (auth.token && profile.ids.every((item) => item !== id)) {
      dispatch(getProfileUsers({ id, auth }));
    }
  }, [id, auth, dispatch, profile.ids]);

  useEffect(() => {
    if (auth.token && auth.user._id === id && suggestions.users.length === 0) {
      dispatch(getSuggestions(auth.token));
    }
  }, [id, auth, dispatch, suggestions.users.length]);

  // Check if we have user data and posts data for this profile
  const hasUserData = profile.users.some((user) => user._id === id);
  const hasPostsData = profile.posts.some((post) => post._id === id);
  const isDataLoaded = hasUserData && hasPostsData;

  // Show loading spinner if auth is not loaded yet
  if (!auth.token || !auth.user) {
    return (
      <div className="profile_page">
        <div className="profile_loading_container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner type="dots" text="Loading..." size="medium" />
        </div>
      </div>
    );
  }

  return (
    <div className="profile_page">
      <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

      {/* Suggestions Carousel - Only show on own profile when suggestions are available */}
      {auth.user._id === id && suggestions.users && suggestions.users.length > 0 && (
        <div className="profile_suggestions_carousel">
          <div className="suggestions_header">
            <h5>
              <i className="fas fa-users"></i>
              Suggestions for you
            </h5>
            <button 
              className="refresh_btn"
              onClick={() => dispatch(getSuggestions(auth.token))}
              disabled={suggestions.loading}
            >
              <i className={`fas fa-sync-alt ${suggestions.loading ? 'fa-spin' : ''}`}></i>
            </button>
          </div>
          
          <div className="suggestions_scroll_container">
            <div className="suggestions_scroll">
              {suggestions.users.map((user) => (
                <div key={user._id} className="suggestion_card">
                  <UserCard user={user} border="">
                    <FollowBtn user={user} />
                  </UserCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {auth.user._id === id && (
        <div className="profile_tab">
          <button
            className={saveTab ? "" : "active"}
            onClick={() => setSaveTab(false)}
          >
            <i className="fas fa-th-large" style={{ marginRight: "8px" }}></i>
            Posts
          </button>
          <button
            className={saveTab ? "active" : ""}
            onClick={() => setSaveTab(true)}
          >
            <i className="fas fa-bookmark" style={{ marginRight: "8px" }}></i>
            Saved
          </button>
        </div>
      )}

      <div className="profile_content_section">
        {profile.loading && !isDataLoaded ? (
          <div className="profile_loading_container">
            <LoadingSpinner
              type="dots"
              text="Loading profile content..."
              size="medium"
            />
          </div>
        ) : (
          <>
            {saveTab ? (
              <Saved auth={auth} dispatch={dispatch} />
            ) : (
              <Posts
                auth={auth}
                profile={profile}
                dispatch={dispatch}
                id={id}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
