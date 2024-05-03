import React from 'react';
import Avatar from '../../Avatar';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { deletePost } from '../../../redux/actions/postAction';
import { BASE_URL } from '../../../utils/config';

const CardHeader = ({ post }) => {
  const { auth, socket } = useSelector(state => state);
  const dispatch = useDispatch();

  const history = useHistory();

  const handleEditPost = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure want to delete this post?")) {
      dispatch(deletePost({ post, auth, socket }));
      return history.push("/");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`);
  };

  return (
    <div className="card_header">
      <div className="d-flex">
        {post.user && post.user.avatar && (
          <Avatar src={post.user.avatar} size="big-avatar" />
        )}

        <div className="card_name mx-2 ">
          <h6 className="m-0">
            {post.user ? (
              <Link to={`/profile/${post.user._id}`} className="text-dark">
                {post.user.fullname}
              </Link>
            ) : (
              "Unknown User"
            )}
          </h6>
          <small className="text-muted">
            {moment(post.createdAt).fromNow()}
          </small>
        </div>
      </div>

      <div className="nav-item dropdown" style={{width: ""}}>
        <span
          className="material-icons"
          id="moreLink"
          data-toggle="dropdown"
        >
          more_vert
        </span>

        <div className="dropdown-menu p-0" style={{fontSize: "100%" , width:"20px"}} >
          {auth.user?._id === post.user?._id && (
            <>
              <div className="dropdown-item" onClick={handleEditPost}>
                <span className="material-icons">create</span> Edit Post
              </div>
              <div className="dropdown-item" onClick={handleDeletePost}>
                <span className="material-icons">delete_outline</span> Remove Post
              </div>
            </>
          )}

          <div className="dropdown-item" onClick={handleCopyLink}>
            <span className="material-icons">content_copy</span> Copy Link
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
