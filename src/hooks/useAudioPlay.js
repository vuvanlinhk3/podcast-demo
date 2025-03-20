import { useState, useCallback, useEffect } from "react";

const useAudioPlayer = (audioRef, currentPodcast, currentEpisodeIndex, qualityRef, nextEpisode) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);

  // Xác định nguồn dữ liệu (Home hay Details) dựa trên cấu trúc podcast
  const isFromHome = currentPodcast?.episodes?.length === 1 && currentPodcast.episodes[0].title === "Latest Episode";

  // Fetch và parse RSS nếu từ Home
  useEffect(() => {
    const fetchAudioUrl = async () => {
      if (currentPodcast && audioRef.current) {
        const episode = currentPodcast.episodes[currentEpisodeIndex];
        if (episode && episode.audio && isFromHome) {
          try {
            const API_URL = "https://backend-podcast.onrender.com/api/podcasts";

            const response = await fetch(`${API_URL}/proxy?url=${encodeURIComponent(episode.audio)}`);
            const rssText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(rssText, "text/xml");
            const items = xmlDoc.getElementsByTagName("item");
            if (items.length > 0) {
              const latestItem = items[0];
              const enclosure = latestItem.getElementsByTagName("enclosure")[0];
              const url = enclosure?.getAttribute("url");
              setAudioUrl(url || null);
            }
          } catch (err) {
            console.error("Lỗi khi fetch hoặc parse RSS từ Home:", err);
            setAudioUrl(episode.audio); // Fallback về feedUrl nếu lỗi
          }
        } else if (episode && episode.audio) {
          // Từ Details, dùng trực tiếp URL audio
          setAudioUrl(episode.audio);
        }
      }
    };

    fetchAudioUrl();
  }, [currentPodcast, currentEpisodeIndex, audioRef, isFromHome]);

  // Cập nhật nguồn audio khi có URL
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      const audio = audioRef.current;
      const qualityParam = qualityRef.current;
      const wasPlaying = !audio.paused;

      audio.src = `${audioUrl}?quality=${qualityParam}`;
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
  }, [audioUrl, audioRef, qualityRef]);

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

export default useAudioPlayer;