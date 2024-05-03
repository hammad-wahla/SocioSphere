import React, { useState } from "react";
import Draggable from "react-draggable";
import ReactPlayer from "react-player";

const SongUploadPopup = () => {
  const [playlist, setPlaylist] = useState([]);
  const [popupSong, setPopupSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const handleSongUpload = (files) => {
    const newSongs = Array.from(files).map((file) => {
      const fileNameWithoutExtension = file.name
        .split(".")
        .slice(0, -1)
        .join(".");
      const songURL = URL.createObjectURL(file);
      return { name: fileNameWithoutExtension, url: songURL };
    });
    setPlaylist([...playlist, ...newSongs]);
    setPopupSong(playlist.length);
    setIsPlaying(true);
    setIsPlayerVisible(true);
  };

  const handleClosePopup = () => {
    setIsPlayerVisible(false);
  };

  const handleReopenPlayer = () => {
    setIsPlayerVisible(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (delta) => {
    setVolume((prevVolume) => Math.max(0, Math.min(1, prevVolume + delta)));
  };

  const handleProgress = (state) => {
    setProgress(state.played);
  };

  const handleNext = () => {
    if (popupSong !== null && popupSong < playlist.length - 1) {
      setPopupSong(popupSong + 1);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (popupSong !== null && popupSong > 0) {
      setPopupSong(popupSong - 1);
      setIsPlaying(true);
    }
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (isPlaying) {
      setIsPlaying(false);
    }
  };

  const handleProgressDragEnd = () => {
    if (popupSong !== null) {
      setIsPlaying(true);
    }
  };

  const centerStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div>
      <div className="d-flex mt-2" style={{ flexDirection: "row" }}>
        <div className="">
          {!isPlayerVisible && (
            <button className="text-danger btn-sm" onClick={handleReopenPlayer}>
              <i className="fas fa-music"></i>
            </button>
          )}
        </div>
        <div className="">
          <label htmlFor="file-input" className="btn-sm text-danger">
            <i className="fas fa-upload"></i>
            <input
              id="file-input"
              type="file"
              accept=".mp3"
              multiple
              onChange={(e) => handleSongUpload(e.target.files)}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      {isPlayerVisible && (
        <div style={centerStyle}>
          <Draggable>
            <div
              className="py-2 px-3"
              style={{
                width: "", 
                background: "#fff",
                borderRadius: "15px",
                border: "1px solid lightgrey",
              }}
            >
              <div className="d-flex justify-content-between"
              //  style={{background: "lightgrey", padding :"3px 10px", borderRadius: "5px"}}
              >
                <h5 className="p-1 mr-2">{playlist[popupSong]?.name}</h5>
                <button
                  className=""
                  style={{background: "none"}}
                  onClick={handleClosePopup}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <ReactPlayer
                url={playlist[popupSong]?.url}
                playing={isPlaying}
                volume={volume}
                width="100%"
                height="0px" 
                onProgress={handleProgress}
                progress={progress}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="any"
                value={progress}
                onChange={handleProgressChange}
                onMouseUp={handleProgressDragEnd}
                onTouchEnd={handleProgressDragEnd}
              />
              <div className="button-group d-flex justify-content-around" style={{marginTop: "-15px"}}>
                <button onClick={handlePlayPause}>
                  {isPlaying ? (
                    <i className="fas fa-pause"></i>
                  ) : (
                    <i className="fas fa-play"></i>
                  )}
                </button>
                <button onClick={() => handleVolumeChange(-0.1)}>
                  <i className="fas fa-volume-down"></i>
                </button>
                <button onClick={() => handleVolumeChange(0.1)}>
                  <i className="fas fa-volume-up"></i>
                </button>
                <button onClick={handlePrevious}>
                  <i className="fas fa-step-backward"></i>
                </button>
                <button onClick={handleNext}>
                  <i className="fas fa-step-forward"></i>
                </button>
              </div>
            </div>
          </Draggable>
        </div>
      )}
    </div>
  );
};

export default SongUploadPopup;
