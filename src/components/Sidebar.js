import { Link } from "react-router-dom";
import { Home, Search, Settings, Menu } from "@mui/icons-material"; // Thêm Menu icon
import { useState } from "react"; // Thêm useState để toggle
import "../css/Sidebar.css";

function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái toggle menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          <Menu className="icon" />
        </button>
        <h2 className="logo">Podcasts</h2>
      </div>
      <ul className={`menu ${isMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" className="menu-item" onClick={() => setIsMenuOpen(false)}>
            <Home className="icon" /> Trang Chủ
          </Link>
        </li>
        <li>
          <Link to="/search" className="menu-item" onClick={() => setIsMenuOpen(false)}>
            <Search className="icon" /> Tìm Kiếm
          </Link>
        </li>
        <li>
          <Link to="/settings" className="menu-item" onClick={() => setIsMenuOpen(false)}>
            <Settings className="icon" /> Cài Đặt
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;