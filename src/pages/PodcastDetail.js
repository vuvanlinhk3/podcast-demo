import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/PodcastDetail.css";
import "react-h5-audio-player/lib/styles.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";

function PodcastDetail({ handlePlayPodcast }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch thông tin podcast từ iTunes API
  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const response = await fetch(`https://itunes.apple.com/lookup?id=${id}&entity=podcast`);
        if (!response.ok) throw new Error("Không thể lấy dữ liệu podcast");
        const data = await response.json();

        if (data.resultCount === 0) {
          throw new Error("Podcast không tồn tại");
        }

        const podcastData = data.results[0];
        const podcastInfo = {
          id: podcastData.collectionId,
          title: podcastData.collectionName,
          author: podcastData.artistName,
          description: `A podcast by ${podcastData.artistName}`,
          image: podcastData.artworkUrl600 || podcastData.artworkUrl100,
          feedUrl: podcastData.feedUrl,
        };
        setPodcast(podcastInfo);

        // Fetch và parse RSS để lấy danh sách tập
        const rssResponse = await fetch(podcastData.feedUrl);
        const rssText = await rssResponse.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssText, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");

        const episodeList = Array.from(items).map((item, index) => ({
          id: index.toString(), // ID tạm thời
          title: item.getElementsByTagName("title")[0]?.textContent || "Unknown Title",
          description: item.getElementsByTagName("description")[0]?.textContent || "No description",
          image: podcastData.artworkUrl100,
          audio: item.getElementsByTagName("enclosure")[0]?.getAttribute("url") || "",
          duration: item.getElementsByTagName("itunes:duration")[0]?.textContent || "Unknown",
        }));

        setEpisodes(episodeList);
        setCurrentEpisode(episodeList[0] || null); // Tập đầu tiên là mặc định
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <h2>{error}</h2>;
  if (!podcast) return <h2>Podcast không tồn tại!</h2>;

  // Phát tập đầu tiên khi nhấp nút "Play Trailer"
  const handlePlayTrailer = () => {
    if (episodes.length > 0) {
      setCurrentEpisode(episodes[0]); // Đặt tập đầu tiên là currentEpisode
      handlePlayPodcast({ ...podcast, episodes: [episodes[0]] }); // Truyền tập đầu tiên để phát
    }
  };

  // Phát tập được chọn khi nhấp vào episode
  const handleEpisodeClick = (episode) => {
    setCurrentEpisode(episode); // Cập nhật tập hiện tại
    handlePlayPodcast({ ...podcast, episodes: [episode] }); // Truyền tập được chọn để phát
  };

  return (
    <div className="podcast-detail">
      <div className="detail-header">
        <img src={podcast.image} alt={podcast.title} className="detail-image" />
        <div className="detail-info">
          <h2>{podcast.title}</h2>
          <p className="podcast-author">{podcast.author}</p>
          <p className="podcast-description">{podcast.description}</p>
          <div className="buttons">
            <button className="play-trailer" onClick={handlePlayTrailer}>
              <PlayArrowIcon /> Play Trailer
            </button>
            <button className="follow">
              <FavoriteIcon /> Follow
            </button>
          </div>
        </div>
      </div>
      <div className="episodes-list">
        <h3>Episodes</h3>
        {episodes.map((episode) => (
          <div
            key={episode.id}
            className={`episode-item ${episode.id === currentEpisode?.id ? "playing" : ""}`}
            onClick={() => handleEpisodeClick(episode)}
          >
            <img src={episode.image} alt={episode.title} className="episode-image" />
            <div className="episode-info">
              <h4>{episode.title}</h4>
              <p className="episode-description">{episode.description}</p>
              <p className="episode-duration">{episode.duration} min</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PodcastDetail;