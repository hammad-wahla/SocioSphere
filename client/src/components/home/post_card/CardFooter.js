import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LikeButton from "../../LikeButton";
import { useSelector, useDispatch } from "react-redux";
import {
  likePost,
  unLikePost,
  savePost,
  unSavePost,
} from "../../../redux/actions/postAction";
import ShareModal from "../../ShareModal";
import { BASE_URL } from "../../../utils/config";

const CardFooter = ({ post, onCommentIconClick, onToggleComments, showComments }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);

  const [isShare, setIsShare] = useState(false);

  const { auth, theme, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);

  // Likes
  useEffect(() => {
    if (
      post &&
      post.likes &&
      post.likes.find((like) => like._id === auth.user._id)
    ) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post, auth.user._id]);

  const handleLike = async () => {
    if (loadLike) return;

    setLoadLike(true);
    await dispatch(likePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (loadLike) return;

    setLoadLike(true);
    await dispatch(unLikePost({ post, auth, socket }));
    setLoadLike(false);
  };

  // Saved
  useEffect(() => {
    if (
      auth.user &&
      auth.user.saved &&
      auth.user.saved.find((id) => id === post._id)
    ) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [auth.user, post._id]);

  const handleSavePost = async () => {
    if (saveLoad) return;

    setSaveLoad(true);
    await dispatch(savePost({ post, auth }));
    setSaveLoad(false);
  };

  const handleUnSavePost = async () => {
    if (saveLoad) return;

    setSaveLoad(true);
    await dispatch(unSavePost({ post, auth }));
    setSaveLoad(false);
  };

  return (
    <div className="card_footer">
      <div className="card_icon_menu">
        <div>
          <LikeButton
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />

          <i 
            className="far fa-comment" 
            onClick={onCommentIconClick || (() => {})}
          />

          <i className="fas fa-share" onClick={() => setIsShare(!isShare)} />
        </div>

        {saved ? (
          <i className="fas fa-bookmark text-info" onClick={handleUnSavePost} />
        ) : (
          <i className="far fa-bookmark" onClick={handleSavePost} />
        )}
      </div>

      <div className="d-flex justify-content-between">
        <h6 style={{ padding: "0 25px 8px 25px", cursor: "default" }}>
          {post && post.likes && post.likes.length === 1 && (
            <i className="far fa-star text-warning mr-1" title="Star" />
          )}
          {post && post.likes && post.likes.length === 2 && (
            <i
              className="fas fa-star-half-alt text-warning mr-1"
              title="Star"
            />
          )}
          {post && post.likes && post.likes.length >= 3 && (
            <i className="fas fa-star text-warning mr-1" title="Star" />
          )}
          {post && post.likes && post.likes.length} likes
        </h6>
        <h6 
          style={{ 
            padding: "0 25px 8px 25px", 
            cursor: post && post.comments && post.comments.length > 0 ? "pointer" : "default",
            opacity: post && post.comments && post.comments.length > 0 ? 1 : 0.7
          }}
          onClick={post && post.comments && post.comments.length > 0 ? (onToggleComments || (() => {})) : undefined}
        >
          {post &&
            post.comments &&
            post.comments.length >= 5 &&
            post.comments.length < 10 && (
              <i className="far fa-star text-warning mr-1" title="Star" />
            )}
          {post &&
            post.comments &&
            post.comments.length >= 10 &&
            post.comments.length < 15 && (
              <i
                className="fas fa-star-half-alt text-warning mr-1"
                title="Star"
              />
            )}
          {post && post.comments && post.comments.length >= 15 && (
            <i className="fas fa-star text-warning mr-1" title="Star" />
          )}
          {showComments && post && post.comments && post.comments.length > 0
            ? "Hide comments" 
            : `${post && post.comments && post.comments.length} comments`
          }
        </h6>
      </div>

      {isShare && (
        <ShareModal
          url={`${BASE_URL}/post/${post && post._id}`}
          theme={theme}
        />
      )}
    </div>
  );
};

export default CardFooter;
