import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSuggestions } from "../redux/actions/suggestionsAction";
import UserCard from "./UserCard";
import FollowBtn from "./FollowBtn";
import LoadingSpinner from "./LoadingSpinner";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserSuggestionsCarousel = () => {
  const { auth, suggestions } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const carouselRef = useRef(null);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollPosition);
      return () => carousel.removeEventListener("scroll", checkScrollPosition);
    }
  }, [suggestions.users]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      const currentScroll = carouselRef.current.scrollLeft;
      carouselRef.current.scrollTo({
        left: direction === "left" 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (suggestions.loading) {
    return (
      <div className="user-suggestions-carousel">
        <div className="carousel-header">
          <h5>Suggestions for you</h5>
        </div>
        <div className="carousel-loading">
          <LoadingSpinner type="dots" text="Finding suggestions..." size="small" />
        </div>
      </div>
    );
  }

  if (!suggestions.users || suggestions.users.length === 0) {
    return (
      <div className="user-suggestions-carousel">
        <div className="carousel-header">
          <h5>Suggestions for you</h5>
        </div>
        <div className="carousel-empty">
          <i className="fas fa-user-plus"></i>
          <p>No suggestions available</p>
          <small>Follow more people to get better suggestions</small>
        </div>
      </div>
    );
  }

  return (
    <div className="user-suggestions-carousel">
      <div className="carousel-header">
        <h5>Suggestions for you</h5>
        <button 
          className="refresh-btn"
          onClick={() => dispatch(getSuggestions(auth.token))}
          title="Refresh suggestions"
        >
          <i className="fas fa-redo"></i>
        </button>
      </div>
      
      <div className="carousel-container">
        {showLeftArrow && (
          <button 
            className="carousel-arrow carousel-arrow-left"
            onClick={() => scroll("left")}
            aria-label="Previous suggestions"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        )}
        
        <div className="carousel-track" ref={carouselRef}>
          {suggestions.users.map((user) => (
            <div key={user._id} className="suggestion-card">
              <Link to={`/profile/${user._id}`} className="suggestion-avatar">
                <Avatar src={user.avatar} size="suggestion-avatar" />
              </Link>
              
              <Link to={`/profile/${user._id}`} className="suggestion-info">
                <h6>{user.username}</h6>
                <span>{user.fullname}</span>
              </Link>
              
              <FollowBtn user={user} />
            </div>
          ))}
        </div>
        
        {showRightArrow && (
          <button 
            className="carousel-arrow carousel-arrow-right"
            onClick={() => scroll("right")}
            aria-label="Next suggestions"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserSuggestionsCarousel;