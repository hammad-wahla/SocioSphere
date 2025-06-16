import React, { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar";
import FollowBtn from "./FollowBtn";
import { Link } from "react-router-dom";

const CompactUserCarousel = ({ users, title = "Suggested for you" }) => {
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
      window.addEventListener("resize", checkScrollPosition);
      return () => {
        carousel.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      };
    }
  }, [users]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const cardWidth = 280; // Approximate width of one card
      const currentScroll = carouselRef.current.scrollLeft;
      carouselRef.current.scrollTo({
        left: direction === "left" 
          ? currentScroll - cardWidth 
          : currentScroll + cardWidth,
        behavior: "smooth"
      });
    }
  };

  if (!users || users.length === 0) return null;

  return (
    <div className="compact-user-carousel">
      {title && (
        <div className="compact-carousel-header">
          <span>{title}</span>
          <Link to="/discover" className="see-all-link">See all</Link>
        </div>
      )}
      
      <div className="compact-carousel-container">
        {showLeftArrow && (
          <button 
            className="compact-carousel-arrow compact-carousel-arrow-left"
            onClick={() => scroll("left")}
            aria-label="Previous"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        )}
        
        <div className="compact-carousel-track" ref={carouselRef}>
          {users.map((user) => (
            <div key={user._id} className="compact-user-card">
              <Link to={`/profile/${user._id}`} className="compact-user-avatar">
                <Avatar src={user.avatar} size="medium-avatar" />
              </Link>
              
              <div className="compact-user-info">
                <Link to={`/profile/${user._id}`} className="compact-user-name">
                  <span className="username">{user.username}</span>
                  <span className="fullname">{user.fullname}</span>
                </Link>
                <FollowBtn user={user} />
              </div>
            </div>
          ))}
        </div>
        
        {showRightArrow && (
          <button 
            className="compact-carousel-arrow compact-carousel-arrow-right"
            onClick={() => scroll("right")}
            aria-label="Next"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default CompactUserCarousel;