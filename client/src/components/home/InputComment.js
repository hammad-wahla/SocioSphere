import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createComment } from "../../redux/actions/commentAction";
import Icons from "../Icons";
import Avatar from "../Avatar";

const InputComment = ({ children, post, replyTo, setReplyTo, focusInput, setFocusInput }) => {
  const [content, setContent] = useState("");
  const inputRef = useRef(null);

  const { auth, socket, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (focusInput && inputRef.current) {
      inputRef.current.focus();
      setFocusInput(false);
    }
  }, [focusInput, setFocusInput]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      if (setReplyTo) return setReplyTo(null);
      return;
    }

    setContent("");

    const newComment = {
      content,
      likes: [],
      user: auth.user,
      createdAt: new Date().toISOString(),
      reply: replyTo && replyTo.commentId,
      tag: replyTo && replyTo.user,
    };

    dispatch(createComment({ post, newComment, auth, socket }));

    if (setReplyTo) return setReplyTo(null);
  };

  return (
    <div className="comment_display">
      <div className="comment_card">
        <div className="d-flex align-items-center">
          <Avatar src={auth.user.avatar} size="medium-avatar" />
          <h6
            style={{
              color: "var(--text-primary)",
              fontWeight: 600,
              margin: 0,
              fontSize: "14px",
            }}
          >
            {auth.user.fullname}
          </h6>
        </div>

        <form className="comment_input_bubble" onSubmit={handleSubmit}>
          <div className="comment_content input_comment_content">
            {replyTo && (
              <div className="reply-indicator">
                <span
                  style={{
                    color: "#0dcaf0",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  Replying to @{replyTo.user.username}
                </span>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "2px 6px",
                    marginLeft: "8px",
                    fontSize: "12px",
                  }}
                >
                  ✕
                </button>
              </div>
            )}
            <div className="comment_input_row">
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  replyTo
                    ? `Reply to ${replyTo.user.fullname}...`
                    : "Add your comments..."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="comment_text_input"
              />

              <div className="comment_actions_right">
                <Icons setContent={setContent} content={content} />
                <button type="submit" className="postBtn">
                  {replyTo ? "Reply" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputComment;
