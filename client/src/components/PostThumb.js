import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PostThumb = ({ posts, result }) => {
  const { theme } = useSelector((state) => state);

  if (result === 0)
    return <h4 className="text-center mt-3 text-info ">No posts yet</h4>;

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
                  style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                />
              ) : (
                <img
                  src={post.images[0].url}
                  alt={post.images[0].url}
                  style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                />
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
