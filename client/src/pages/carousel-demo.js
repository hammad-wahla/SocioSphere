import React from "react";
import UserSuggestionsCarousel from "../components/UserSuggestionsCarousel";
import CompactUserCarousel from "../components/CompactUserCarousel";
import "../styles/user-suggestions-carousel.css";
import "../styles/compact-user-carousel.css";

// Demo data for showcase
const demoUsers = [
  {
    _id: "1",
    username: "john_doe",
    fullname: "John Doe",
    avatar: "https://picsum.photos/200/200?random=1"
  },
  {
    _id: "2", 
    username: "jane_smith",
    fullname: "Jane Smith",
    avatar: "https://picsum.photos/200/200?random=2"
  },
  {
    _id: "3",
    username: "mike_wilson",
    fullname: "Mike Wilson", 
    avatar: "https://picsum.photos/200/200?random=3"
  },
  {
    _id: "4",
    username: "sarah_jones",
    fullname: "Sarah Jones",
    avatar: "https://picsum.photos/200/200?random=4"
  },
  {
    _id: "5",
    username: "alex_brown",
    fullname: "Alex Brown",
    avatar: "https://picsum.photos/200/200?random=5"
  },
  {
    _id: "6",
    username: "emma_davis",
    fullname: "Emma Davis",
    avatar: "https://picsum.photos/200/200?random=6"
  },
  {
    _id: "7",
    username: "chris_martin",
    fullname: "Chris Martin",
    avatar: "https://picsum.photos/200/200?random=7"
  },
  {
    _id: "8",
    username: "lisa_anderson",
    fullname: "Lisa Anderson",
    avatar: "https://picsum.photos/200/200?random=8"
  }
];

const CarouselDemo = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "40px" }}>Carousel Components Demo</h1>
      
      <section style={{ marginBottom: "60px" }}>
        <h2 style={{ marginBottom: "20px" }}>User Suggestions Carousel</h2>
        <p style={{ marginBottom: "20px", color: "var(--text-secondary)" }}>
          Full-featured carousel for displaying suggested users with vertical cards
        </p>
        <UserSuggestionsCarousel />
      </section>

      <section style={{ marginBottom: "60px" }}>
        <h2 style={{ marginBottom: "20px" }}>Compact User Carousel</h2>
        <p style={{ marginBottom: "20px", color: "var(--text-secondary)" }}>
          Horizontal card layout for inline suggestions
        </p>
        <CompactUserCarousel users={demoUsers} title="People you may know" />
      </section>

      <section style={{ marginBottom: "60px" }}>
        <h2 style={{ marginBottom: "20px" }}>Compact Carousel - Mini Variant</h2>
        <p style={{ marginBottom: "20px", color: "var(--text-secondary)" }}>
          Minimal style for embedding within feeds
        </p>
        <div className="compact-user-carousel mini">
          <CompactUserCarousel users={demoUsers.slice(0, 5)} title="Similar accounts" />
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: "20px" }}>Features</h2>
        <ul style={{ lineHeight: "2" }}>
          <li>Smooth horizontal scrolling with touch support</li>
          <li>Smart arrow navigation (auto-hide at edges)</li>
          <li>Responsive design for mobile and desktop</li>
          <li>Loading and empty states</li>
          <li>Refresh functionality</li>
          <li>Follow/Unfollow integration</li>
          <li>Accessible with keyboard navigation</li>
          <li>Dark theme support</li>
        </ul>
      </section>
    </div>
  );
};

export default CarouselDemo;