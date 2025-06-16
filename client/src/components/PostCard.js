import React, { useState, createContext, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CardHeader from "./home/post_card/CardHeader";
import CardBody from "./home/post_card/CardBody";
import CardFooter from "./home/post_card/CardFooter";

import Comments from "./home/Comments";
import InputComment from "./home/InputComment";

// Create context for reply state
const ReplyContext = createContext();

export const useReply = () => {
  const context = useContext(ReplyContext);
  if (!context) {
    throw new Error("useReply must be used within a ReplyProvider");
  }
  return context;
};

const PostCard = ({ post, theme }) => {
  const location = useLocation();
  const [replyTo, setReplyTo] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [focusInput, setFocusInput] = useState(false);

  // Check if we're on a post detail page (URL contains /post/ followed by an ID)
  const isPostDetailPage =
    location.pathname.startsWith("/post/") &&
    location.pathname.split("/").length === 3 &&
    location.pathname.split("/")[2];

  // Apply special styling only on post detail pages
  const cardStyle = isPostDetailPage ? { width: "50%", margin: "auto" } : {};

  // Show comments by default on post detail page
  useEffect(() => {
    if (isPostDetailPage) {
      setShowComments(true);
    }
  }, [isPostDetailPage]);

  const handleCommentIconClick = () => {
    if (!showComments) {
      setShowComments(true);
      setFocusInput(true);
    } else {
      setShowComments(false);
      setFocusInput(false);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
    setFocusInput(false);
  };

  return (
    <ReplyContext.Provider value={{ replyTo, setReplyTo }}>
      <div className="card my-3 " style={cardStyle}>
        <CardHeader post={post} />
        <CardBody post={post} theme={theme} />
        <CardFooter 
          post={post} 
          onCommentIconClick={handleCommentIconClick}
          onToggleComments={handleToggleComments}
          showComments={showComments}
        />

        <div className={`comments-section ${showComments ? 'show' : ''}`}>
          {showComments && (
            <>
              <Comments post={post} />
              <InputComment 
                post={post} 
                replyTo={replyTo} 
                setReplyTo={setReplyTo}
                focusInput={focusInput}
                setFocusInput={setFocusInput}
              />
            </>
          )}
        </div>
      </div>
    </ReplyContext.Provider>
  );
};

export default PostCard;
