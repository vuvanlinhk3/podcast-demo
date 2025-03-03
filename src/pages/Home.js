import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Home.css";
import Slide from "../components/slide";

function Home({ handlePlayPodcast }) {
  const navigate = useNavigate();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm fetch dữ liệu từ iTunes Search API
  const fetchPodcasts = async () => {
    try {
      const response = await fetch("https://itunes.apple.com/search?term=startups&media=podcast&limit=50");
      if (!response.ok) throw new Error("Không thể lấy dữ liệu từ API");
      const data = await response.json();

      // Nhóm podcasts theo thể loại (primaryGenreName)
      const groupedPodcasts = data.results.reduce((acc, podcast) => {
        const genre = podcast.primaryGenreName || "Khác";
        if (!acc[genre]) {
          acc[genre] = [];
        }
        acc[genre].push({
          id: podcast.collectionId,
          title: podcast.collectionName,
          description: `A podcast by ${podcast.artistName}`, // Tạo mô tả đơn giản
          image: podcast.artworkUrl600 || podcast.artworkUrl100,
          episodes: [
            {
              title: "Latest Episode", // Giả lập vì API không trả về danh sách tập
              audio: podcast.feedUrl // Dùng feedUrl tạm thời
            }
          ]
        });
        return acc;
      }, {});

      // Chuyển đổi object thành mảng để render
      const podcastCategories = Object.entries(groupedPodcasts).map(([genre, podcasts]) => ({
        genre,
        podcasts
      }));

      setPodcasts(podcastCategories);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Gọi fetch khi component mount
  useEffect(() => {
    fetchPodcasts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="home-container">
      <Slide/>
      <div className="category-list">
        {podcasts.map((category) => (
          <div key={category.genre} className="category-section">
            <h3>{category.genre}</h3>
            <div className="podcast-grid">
              {category.podcasts.map((podcast) => (
                <div key={podcast.id} className="podcast-card">
                  <img
                    src={podcast.image}
                    alt={podcast.title}
                    className="podcast-image"
                    onClick={() => navigate(`/podcast/${podcast.id}`)}
                  />
                  <div className="podcast-info">
                    <Link to={`/podcast/${podcast.id}`} className="podcast-link">
                      {podcast.title}
                    </Link>
                    <p>{podcast.description}</p>
                    <button onClick={() => handlePlayPodcast(podcast)} className="play-btn">
                      ▶ Phát
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;