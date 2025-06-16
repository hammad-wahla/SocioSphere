import React from "react";
import { useSelector } from "react-redux";
import UserSuggestionsCarousel from "../UserSuggestionsCarousel";
import CompactUserCarousel from "../CompactUserCarousel";
import "../../styles/user-suggestions-carousel.css";
import "../../styles/compact-user-carousel.css";

const SuggestionsSection = ({ variant = "full" }) => {
  const { suggestions } = useSelector((state) => state);

  // For the full carousel, use the UserSuggestionsCarousel component
  if (variant === "full") {
    return <UserSuggestionsCarousel />;
  }

  // For the compact variant, use the CompactUserCarousel
  if (variant === "compact" && suggestions.users && suggestions.users.length > 0) {
    return (
      <CompactUserCarousel 
        users={suggestions.users} 
        title="Suggested for you"
      />
    );
  }

  // For the mini variant (inline in feed)
  if (variant === "mini" && suggestions.users && suggestions.users.length > 0) {
    return (
      <div className="compact-user-carousel mini">
        <CompactUserCarousel 
          users={suggestions.users.slice(0, 5)} 
          title="People you may know"
        />
      </div>
    );
  }

  return null;
};

export default SuggestionsSection;