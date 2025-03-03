import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { IconButton, MenuItem, Select } from "@mui/material";
import { PlayArrow, Pause, Replay10, Forward10, VolumeUp, VolumeOff, Fullscreen, Download } from "@mui/icons-material";
import "../css/ModelPlay.css";
import useAudioPlayer from "../hooks/useAudioPlay.js";
import useAudioDownload from "../hooks/useAudioDownload.js";

function ModelPlay({ currentPodcast }) {
  const audioRef = useRef(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState("128kbps");
  const [showQualityOptions, setShowQualityOptions] = useState(false);

  const qualityRef = useRef(selectedQuality);
  const qualityOptions = useMemo(() => ({
    "128kbps": "low",
    "256kbps": "medium",
    "320kbps": "high",
  }), []);

  useEffect(() => {
    setCurrentEpisodeIndex(0);
  }, [currentPodcast]);

  useEffect(() => {
    qualityRef.current = selectedQuality;
  }, [selectedQuality]);

  const nextEpisode = useCallback(() => {
    setCurrentEpisodeIndex((prevIndex) => {
      if (!currentPodcast) return prevIndex;
      const nextIndex = prevIndex + 1;
      return nextIndex < currentPodcast.episodes.length ? nextIndex : prevIndex;
    });
  }, [currentPodcast]);

  const {
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    togglePlay,
    skipTime,
    handleSeek,
    handleVolumeChange
  } = useAudioPlayer(audioRef, currentPodcast, currentEpisodeIndex, qualityRef, nextEpisode);

  const { handleDownload } = useAudioDownload(currentPodcast, currentEpisodeIndex, selectedQuality, qualityOptions);

  return (
    <div className="audio-player">
      <div className="audio-controls">
        <IconButton onClick={() => skipTime(-10)}><Replay10 /></IconButton>
        <IconButton onClick={togglePlay}>{isPlaying ? <Pause /> : <PlayArrow />}</IconButton>
        <IconButton onClick={() => skipTime(10)}><Forward10 /></IconButton>
      </div>

      <div className="info-pod">
        <img src={currentPodcast.image} alt={currentPodcast.title} className="player-image" />
        <div className="player-info">
          <h3>{currentPodcast.title} - {currentPodcast.episodes[currentEpisodeIndex]?.title}</h3>
          <audio ref={audioRef} />
          <div className="progress-bar">
            <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")}</span>
            <div className="progress-container">
              <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                value={currentTime} 
                onChange={handleSeek} 
                className="progress-bar-range"
              />
              <div className="buffered-bar" style={{ width: `${(buffered / duration) * 100}%` }} />
              <div className="played-bar" style={{ width: `${(currentTime / duration) * 100}%` }} />
            </div>
            <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      <div className="control-volume">
        <div className="volume-control">
          <IconButton>{volume === 0 ? <VolumeOff /> : <VolumeUp />}</IconButton>
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolumeChange} />
        </div>
        <div className="fullscreen">
          <IconButton><Fullscreen /></IconButton>
        </div>
      </div>

      <div className={`download-section ${showQualityOptions ? "active" : ""}`}>
        <IconButton onClick={() => setShowQualityOptions(!showQualityOptions)}>
          <Download className="download-icon" />
        </IconButton>
        <div className="download-options">
          <Select value={selectedQuality} onChange={(e) => setSelectedQuality(e.target.value)}>
            <MenuItem value="128kbps">128 kbps</MenuItem>
            <MenuItem value="256kbps">256 kbps</MenuItem>
            <MenuItem value="320kbps">320 kbps</MenuItem>
          </Select>
          <button className="download-btn" onClick={handleDownload}>Tải xuống</button>
        </div>
      </div>
    </div>
  );
}

export default ModelPlay;