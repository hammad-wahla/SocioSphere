import React, { useState, useEffect } from "react";
import CommentDisplay from "./comments/CommentDisplay";

const Comments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [next, setNext] = useState(2);

  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    const newCm = post.comments.filter((cm) => !cm.reply);
    setComments(newCm);
    // Show all comments up to 'next' amount (oldest to newest like social media)
    setShowComments(newCm.slice(0, next));
  }, [post.comments, next]);

  useEffect(() => {
    const newRep = post.comments.filter((cm) => cm.reply);
    setReplyComments(newRep);
  }, [post.comments]);

  return (
    <div className="comments">
      <div className="comments-scrollable-container">
        {showComments.map((comment, index) => (
          <CommentDisplay
            key={index}
            comment={comment}
            post={post}
            replyCm={replyComments.filter((item) => item.reply === comment._id)}
          />
        ))}
      </div>

      {comments.length > next ? (
        <div
          className="comments-show-hide-button"
          onClick={() => setNext(next + 10)}
        >
          <i className="fas fa-chevron-down mr-1"></i>
          Load {Math.min(10, comments.length - next)} more comments
        </div>
      ) : (
        comments.length > 2 &&
        next > 2 && (
          <div className="comments-show-hide-button" onClick={() => setNext(2)}>
            <i className="fas fa-chevron-up mr-1"></i>
            Hide comments
          </div>
        )
      )}
    </div>
  );
};

export default Comments;
