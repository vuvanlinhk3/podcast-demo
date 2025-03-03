import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm chuẩn hóa chuỗi tìm kiếm
  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Debounce để trì hoãn tìm kiếm
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchPodcasts();
    }, 500); // Chờ 500ms trước khi gửi yêu cầu

    return () => clearTimeout(delayDebounce); // Hủy nếu query thay đổi trước khi timeout
  }, [query]);

  // Hàm gọi API iTunes để tìm kiếm podcast
  const fetchPodcasts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&limit=20`
      );
      if (!response.ok) throw new Error("Không thể tìm kiếm podcast");
      const data = await response.json();

      const podcasts = data.results.map((podcast) => ({
        id: podcast.collectionId,
        title: podcast.collectionName,
        author: podcast.artistName,
        image: podcast.artworkUrl100,
      }));

      setResults(podcasts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Tìm Kiếm Podcast</h2>
      <input
        type="text"
        placeholder="Nhập tiêu đề (không cần dấu)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <div className="search-results">
        {loading && <p className="loading">Đang tìm kiếm...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && results.length > 0 ? (
          results.map((podcast) => (
            <div key={podcast.id} className="podcast-item">
              <Link to={`/podcast/${podcast.id}`} className="podcast-link">
                <img src={podcast.image} alt={podcast.title} className="podcast-thumbnail" />
                <div className="podcast-info">
                  <h3>{podcast.title}</h3>
                  <p>{podcast.author}</p>
                </div>
              </Link>
            </div>
          ))
        ) : !loading && !error && query && (
          <p className="no-results">Không tìm thấy podcast phù hợp.</p>
        )}
      </div>
    </div>
  );
}

export default Search;