import React, { useState, useEffect } from "react";
import CommentCard from "./CommentCard";

const CommentDisplay = ({ comment, post, replyCm }) => {
  const [showRep, setShowRep] = useState([]);
  const [next, setNext] = useState(0); // Start with 0 to hide all replies initially
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    if (showReplies) {
      setShowRep(replyCm.slice(0, next || replyCm.length));
    } else {
      setShowRep([]);
    }
  }, [replyCm, next, showReplies]);

  return (
    <div className="comment_display">
      <CommentCard comment={comment} post={post} commentId={comment._id}>
        <div className="pl-4">
          {/* Show/Hide Replies Button */}
          {replyCm.length > 0 && (
            <div
              style={{
                cursor: "pointer",
                color: "#0dcaf0",
                fontSize: "13px",
                fontWeight: "500",
                padding: "8px 0",
                marginBottom: showReplies ? "8px" : "0",
              }}
              onClick={() => {
                if (showReplies) {
                  setShowReplies(false);
                  setNext(0);
                } else {
                  setShowReplies(true);
                  setNext(5); // Show first 5 replies
                }
              }}
            >
              {showReplies ? (
                <>
                  <i className="fas fa-chevron-up mr-1"></i>
                  Hide {replyCm.length}{" "}
                  {replyCm.length === 1 ? "reply" : "replies"}
                </>
              ) : (
                <>
                  <i className="fas fa-chevron-down mr-1"></i>
                  Show {replyCm.length}{" "}
                  {replyCm.length === 1 ? "reply" : "replies"}
                </>
              )}
            </div>
          )}

          {/* Display Replies */}
          {showRep.map(
            (item, index) =>
              item.reply && (
                <CommentCard
                  key={index}
                  comment={item}
                  post={post}
                  commentId={comment._id}
                />
              )
          )}

          {/* Load More Replies Button */}
          {showReplies && replyCm.length > next && (
            <div
              style={{
                cursor: "pointer",
                color: "#0dcaf0",
                fontSize: "13px",
                fontWeight: "500",
                padding: "8px 0",
                marginLeft: "20px",
              }}
              onClick={() => setNext(next + 5)}
            >
              <i className="fas fa-plus-circle mr-1"></i>
              Load {Math.min(5, replyCm.length - next)} more replies...
            </div>
          )}
        </div>
      </CommentCard>
    </div>
  );
};

export default CommentDisplay;
