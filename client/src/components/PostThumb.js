import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PostThumb = ({ posts, result }) => {
  if (result === 0)
    return (
      <div className="text-center py-4">
        <div className="mb-3">
          <i className="fas fa-camera fa-2x text-muted"></i>
        </div>
        <h5 className="text-muted mb-2">No posts shared yet</h5>
        <p className="text-muted">
          When you start sharing photos and thoughts, they'll appear here
        </p>
      </div>
    );

  return (
    <div className="post_thumb">
      {posts.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`}>
          <div className="post_thumb_display">
            {post.images &&
              post.images.length > 0 &&
              (post.images[0].url && post.images[0].url.match(/video/i) ? (
                <video
                  controls
                  src={post.images[0].url}
                  alt={post.images[0].url}
                />
              ) : (
                <img src={post.images[0].url} alt={post.images[0].url} />
              ))}

            <div className="post_thumb_menu">
              <i className="far fa-heart">{post.likes && post.likes.length}</i>
              <i className="far fa-comment">
                {post.comments && post.comments.length}
              </i>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostThumb;
