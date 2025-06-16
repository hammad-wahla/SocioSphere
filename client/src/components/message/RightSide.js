import React, { useState, useEffect, useRef } from "react";
import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import MsgDisplay from "./MsgDisplay";
import Icons from "../Icons";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { imageShow, videoShow } from "../../utils/mediaShow";
import { imageUpload } from "../../utils/imageUpload";
import {
  addMessage,
  getMessages,
  loadMoreMessages,
  deleteConversation,
} from "../../redux/actions/messageAction";
import LoadingSpinner from "../LoadingSpinner";
import ConfirmModal from "../ConfirmModal";

const RightSide = () => {
  const { auth, message, theme, socket, peer } = useSelector((state) => state);
  const dispatch = useDispatch();

  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [loadMedia, setLoadMedia] = useState(false);
  const [showDeleteConversationModal, setShowDeleteConversationModal] =
    useState(false);

  const refDisplay = useRef();
  const pageEnd = useRef();

  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

  const history = useHistory();

  useEffect(() => {
    const newData = message.data.find((item) => item._id === id);
    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
    }
  }, [message.data, id]);

  useEffect(() => {
    if (id && message.users.length > 0) {
      setTimeout(() => {
        refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 50);

      const newUser = message.users.find((user) => user._id === id);
      if (newUser) setUser(newUser);
    }
  }, [message.users, id]);

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newMedia = [];

    files.forEach((file) => {
      if (!file) return (err = "File does not exist.");

      if (file.size > 1024 * 1024 * 5) {
        return (err = "The image/video largest is 5mb.");
      }

      return newMedia.push(file);
    });

    if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    setMedia([...media, ...newMedia]);
  };

  const handleDeleteMedia = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) return;
    setText("");
    setMedia([]);
    setLoadMedia(true);

    let newArr = [];
    if (media.length > 0) newArr = await imageUpload(media);

    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      media: newArr,
      createdAt: new Date().toISOString(),
    };

    setLoadMedia(false);
    await dispatch(addMessage({ msg, auth, socket }));
    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    const getMessagesData = async () => {
      if (message.data.every((item) => item._id !== id)) {
        await dispatch(getMessages({ auth, id }));
        setTimeout(() => {
          refDisplay.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 50);
      }
    };
    getMessagesData();
  }, [id, dispatch, auth, message.data]);

  // Load More
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadMore((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, [setIsLoadMore]);

  useEffect(() => {
    if (isLoadMore > 1) {
      if (result >= page * 9) {
        dispatch(loadMoreMessages({ auth, id, page: page + 1 }));
        setIsLoadMore(1);
      }
    }
    // eslint-disable-next-line
  }, [isLoadMore]);

  const handleDeleteConversation = () => {
    setShowDeleteConversationModal(true);
  };

  const confirmDeleteConversation = () => {
    dispatch(deleteConversation({ auth, id }));
    setShowDeleteConversationModal(false);
    history.push("/message");
  };

  const cancelDeleteConversation = () => {
    setShowDeleteConversationModal(false);
  };

  // Call functions
  const caller = ({ video }) => {
    const { _id, avatar, username, fullname } = user;

    const msg = {
      sender: auth.user._id,
      recipient: _id,
      avatar,
      username,
      fullname,
      video,
    };
    dispatch({ type: GLOBALTYPES.CALL, payload: msg });
  };

  const callUser = ({ video }) => {
    const { _id, avatar, username, fullname } = auth.user;

    const msg = {
      sender: _id,
      recipient: user._id,
      avatar,
      username,
      fullname,
      video,
    };

    if (peer.open) msg.peerId = peer._id;

    socket.emit("callUser", msg);
  };

  const handleAudioCall = () => {
    caller({ video: false });
    callUser({ video: false });
  };

  const handleVideoCall = () => {
    caller({ video: true });
    callUser({ video: true });
  };

  return (
    <div className="chat-container-modern">
      {/* Modern Chat Header */}
      <div className="chat-header-modern">
        {user.length !== 0 && (
          <div className="chat-header-content">
            <div className="chat-user-info">
              <UserCard user={user} />
            </div>
            <div className="chat-actions">
              <button
                className="chat-action-btn audio-call"
                onClick={handleAudioCall}
                title="Audio Call"
              >
                <i className="fas fa-phone-alt"></i>
              </button>
              <button
                className="chat-action-btn video-call"
                onClick={handleVideoCall}
                title="Video Call"
              >
                <i className="fas fa-video"></i>
              </button>
              <button
                className="chat-action-btn delete-chat"
                onClick={handleDeleteConversation}
                title="Delete Conversation"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modern Chat Messages Area */}
      <div className="chat-messages-container">
        <div className="chat-messages-scroll" ref={refDisplay}>
          <button className="load-more-trigger" ref={pageEnd}>
            Load more
          </button>

          {data.map((msg, index) => (
            <div key={index} className="message-wrapper">
              {msg.sender !== auth.user._id && (
                <div className="message-row received">
                  <MsgDisplay user={user} msg={msg} theme={theme} />
                </div>
              )}

              {msg.sender === auth.user._id && (
                <div className="message-row sent">
                  <MsgDisplay
                    user={auth.user}
                    msg={msg}
                    theme={theme}
                    data={data}
                  />
                </div>
              )}
            </div>
          ))}

          {loadMedia && (
            <div className="message-row sent">
              <div className="message-loading">
                <LoadingSpinner type="dots" size="small" />
                <span className="loading-text">Sending...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Preview Area */}
      {media.length > 0 && (
        <div className="media-preview-area">
          <div className="media-preview-grid">
            {media.map((item, index) => (
              <div key={index} className="media-preview-item">
                <div className="media-content">
                  {item.type.match(/video/i)
                    ? videoShow(URL.createObjectURL(item))
                    : imageShow(URL.createObjectURL(item))}
                </div>
                <button
                  className="media-remove-btn"
                  onClick={() => handleDeleteMedia(index)}
                  title="Remove"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modern Chat Input */}
      <div className="chat-input-modern">
        <form className="chat-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="message-input"
            />

            <div className="input-actions">
              <Icons setContent={setText} content={text} />

              <div className="file-upload-btn">
                <i className="fas fa-paperclip"></i>
                <input
                  type="file"
                  name="file"
                  id="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleChangeMedia}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="send-btn"
            disabled={!text.trim() && media.length === 0}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>

      {/* Delete Conversation Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConversationModal}
        onClose={cancelDeleteConversation}
        onConfirm={confirmDeleteConversation}
        title="Delete Conversation"
        message="Do you want to delete this conversation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default RightSide;
