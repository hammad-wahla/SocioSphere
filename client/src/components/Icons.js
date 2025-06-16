import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";

const Icons = ({ setContent, content }) => {
  const { theme } = useSelector((state) => state);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const onEmojiClick = (emojiObject) => {
    setContent(content + emojiObject.emoji);
    setShowPicker(false); // Close picker after selection
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const getPickerStyle = () => {
    return {
      position: "absolute",
      bottom: "100%",
      right: "0",
      left: "auto",
      zIndex: 99999999,
      marginBottom: "10px",
    };
  };

  return (
    <div
      className={`emoji-picker-container ${showPicker ? "open" : ""}`}
      style={{
        position: "relative",
        isolation: "isolate",
      }}
      ref={pickerRef}
    >
      <button
        type="button"
        className="emoji-trigger"
        onClick={() => setShowPicker(!showPicker)}
        style={{
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: "8px",
          borderRadius: "50%",
          transition: "all 0.2s ease",
          backgroundColor: showPicker
            ? "rgba(13, 202, 240, 0.1)"
            : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          color: "#6c757d",
        }}
      >
        <i
          className="fas fa-smile"
          style={{
            fontSize: "16px",
            color: showPicker ? "#0dcaf0" : "#6c757d",
            transition: "color 0.2s ease",
          }}
        ></i>
      </button>

      {showPicker && (
        <div className="emoji-picker-wrapper" style={getPickerStyle()}>
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme={theme ? "dark" : "light"}
            height={400}
            width={350}
            searchDisabled={false}
            skinTonePickerLocation="PREVIEW"
            previewConfig={{
              defaultEmoji: "1f60a",
              defaultCaption: "Choose your emoji!",
            }}
            style={{
              position: "relative",
              zIndex: 99999999,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
              border: "2px solid var(--border-color)",
              backdropFilter: "blur(20px)",
              backgroundColor: "var(--bg-primary)",
              borderRadius: "15px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Icons;
