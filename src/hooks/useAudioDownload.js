import { useCallback } from "react";

const useAudioDownload = (currentPodcast, currentEpisodeIndex, selectedQuality, qualityOptions) => {
  const handleDownload = useCallback(async () => {
    const episode = currentPodcast.episodes[currentEpisodeIndex];
    if (!episode) return;
    const API_URL = "https://backend-podcast.onrender.com/api/podcasts";
    const qualityParam = qualityOptions[selectedQuality];
    const originalUrl = `${episode.audio}?quality=${qualityParam}`;
    const proxyUrl = `${API_URL}/proxy?url=${encodeURIComponent(originalUrl)}`;


    try {
      const response = await fetch(proxyUrl, { mode: "cors" });
      if (!response.ok) throw new Error(`Lỗi tải xuống qua proxy: ${response.status}`);

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${currentPodcast.title} - ${episode.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      console.error("Lỗi khi tải xuống:", error);
    }
  }, [currentPodcast, currentEpisodeIndex, selectedQuality, qualityOptions]);

  return {
    handleDownload,
  };
};

export default useAudioDownload;