# User Suggestions Carousel Components

This document describes the two carousel components available for displaying user suggestions in SocioSphere.

## Components Overview

### 1. UserSuggestionsCarousel
A full-featured vertical card carousel for displaying suggested users, typically used in sidebars.

### 2. CompactUserCarousel  
A horizontal card carousel with a more compact design, suitable for inline placement within feeds or between posts.

## Usage Examples

### Basic Implementation

```jsx
// Import the components and styles
import UserSuggestionsCarousel from "../components/UserSuggestionsCarousel";
import CompactUserCarousel from "../components/CompactUserCarousel";
import "../styles/user-suggestions-carousel.css";
import "../styles/compact-user-carousel.css";

// Full carousel (connects to Redux store automatically)
<UserSuggestionsCarousel />

// Compact carousel with custom users
<CompactUserCarousel 
  users={userArray} 
  title="People you may know" 
/>
```

### Integration with Redux

The `UserSuggestionsCarousel` automatically connects to the Redux store and displays suggestions from the `suggestions` state. It includes:
- Loading states
- Empty states
- Refresh functionality
- Follow/Unfollow integration

### SuggestionsSection Component

For easy integration, use the `SuggestionsSection` wrapper component:

```jsx
import SuggestionsSection from "../components/home/SuggestionsSection";

// Full carousel
<SuggestionsSection variant="full" />

// Compact carousel
<SuggestionsSection variant="compact" />

// Mini carousel (for inline use)
<SuggestionsSection variant="mini" />
```

## Features

### Both Carousels Include:
- **Smooth Scrolling**: Touch-friendly horizontal scrolling
- **Smart Navigation**: Arrow buttons that auto-hide at edges
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Theme Support**: Automatically adapts to theme changes
- **Accessibility**: Keyboard navigation and ARIA labels

### UserSuggestionsCarousel Features:
- Vertical card layout with larger avatars
- Refresh button to get new suggestions
- Loading spinner with custom message
- Empty state with helpful guidance

### CompactUserCarousel Features:
- Horizontal card layout
- "See all" link for navigation
- Configurable title
- Mini variant for minimal space usage

## Styling Customization

### CSS Variables
Both components use CSS variables for theming:
```css
--bg-primary: Background color
--bg-secondary: Secondary background
--border-color: Border color
--text-primary: Primary text color
--text-secondary: Secondary text color
--primary-color: Accent color (default: #0dcaf0)
```

### Avatar Sizes
- `suggestion-avatar`: 80px (64px mobile)
- `medium-avatar`: 44px (40px mobile)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Example Integration in Home Page

```jsx
// In your home page component
import SuggestionsSection from "../components/home/SuggestionsSection";

// After posts, before pagination
{homePosts.posts.length > 3 && (
  <SuggestionsSection variant="mini" />
)}

// In sidebar
<div className="sidebar">
  <SuggestionsSection variant="full" />
</div>
```

## Props Reference

### CompactUserCarousel Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| users | Array | required | Array of user objects |
| title | String | "Suggested for you" | Header title |

### User Object Structure
```js
{
  _id: String,
  username: String,
  fullname: String,
  avatar: String
}
```

## Mobile Considerations

- Arrow navigation is smaller on mobile devices
- Card sizes automatically adjust
- Horizontal scrolling is touch-optimized
- Border radius removed on mobile for full-width appearance

## Performance Tips

1. Limit the number of users displayed (5-10 recommended)
2. Use the `mini` variant for inline placements
3. Lazy load images if dealing with many users
4. Consider virtual scrolling for very large lists