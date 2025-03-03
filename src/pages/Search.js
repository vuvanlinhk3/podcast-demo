import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "../css/Search.css"
import podcastData from "../data/podcasts.json";

function Search() {
  const [query, setQuery] = useState("");

  // Hàm chuẩn hóa chuỗi tìm kiếm: loại bỏ dấu, chuyển thường, bỏ khoảng trắng thừa
  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD") // Chuẩn hóa Unicode để tách dấu
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/\s+/g, " ") // Thay nhiều khoảng trắng bằng 1
      .trim(); // Xóa khoảng trắng đầu/cuối
  };

  // Lọc podcast dựa trên query đã chuẩn hóa
  const filteredPodcasts = (podcastData || []).filter((podcast) => {
    const normalizedTitle = normalizeString(podcast.title || "");
    const normalizedQuery = normalizeString(query);
    return normalizedTitle.includes(normalizedQuery);
  });

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
        {filteredPodcasts.length > 0 ? (
          filteredPodcasts.map((podcast) => (
            <div key={podcast.id} className="podcast-item">
              <Link to={`/podcast/${podcast.id}`} className="podcast-link">
                <h3>{podcast.title}</h3>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-results">Không tìm thấy podcast phù hợp.</p>
        )}
      </div>
    </div>
  );
}

export default Search;