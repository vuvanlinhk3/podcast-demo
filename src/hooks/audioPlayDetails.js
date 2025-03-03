import { useState, useCallback, useEffect } from "react";

const audioPlayDetails = (audioRef, currentPodcast, currentEpisodeIndex, qualityRef, nextEpisode) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);

  // Cập nhật nguồn audio khi podcast hoặc tập thay đổi
  useEffect(() => {
    if (currentPodcast && audioRef.current) {
      const audio = audioRef.current;
      const episode = currentPodcast.episodes[currentEpisodeIndex];

      if (episode && episode.audio) {
        const qualityParam = qualityRef.current;
        const wasPlaying = !audio.paused;

        // Dùng trực tiếp episode.audio làm nguồn
        audio.src = `${episode.audio}?quality=${qualityParam}`;
        audio.load();

        audio.onloadedmetadata = () => {
          if (wasPlaying) {
            audio.play()
              .then(() => setIsPlaying(true))
              .catch((err) => {
                console.error("Lỗi phát audio:", err);
                setIsPlaying(false);
              });
          }
        };

        audio.onerror = () => {
          console.error("Lỗi tải audio:", audio.error);
          setIsPlaying(false);
        };
      }
    }
  }, [currentPodcast, currentEpisodeIndex, audioRef, qualityRef]);

  // Xử lý sự kiện audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnd = () => nextEpisode();
    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);
    const updateBuffered = () => {
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(audio.buffered.length - 1));
      }
    };

    audio.addEventListener("ended", handleEnd);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("progress", updateBuffered);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("ended", handleEnd);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("progress", updateBuffered);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, [audioRef, nextEpisode]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Lỗi phát:", err));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [audioRef]);

  const skipTime = useCallback((seconds) => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime + seconds;
      audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration));
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [audioRef]);

  const handleSeek = useCallback((e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [audioRef]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, [audioRef]);

  return {
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    togglePlay,
    skipTime,
    handleSeek,
    handleVolumeChange,
  };
};

export default audioPlayDetails;