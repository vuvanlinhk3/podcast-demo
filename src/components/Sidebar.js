import { Link } from "react-router-dom";
import { Home, Search, Settings } from "@mui/icons-material"; // Import Material Icons
import "../css/Sidebar.css";

function Sidebar() {
  return (
    <nav className="sidebar">
      <h2 className="logo">Podcasts</h2>
      <ul className="menu">
        <li>
          <Link to="/" className="menu-item">
            <Home className="icon" /> Trang Chủ
          </Link>
        </li>
        <li>
          <Link to="/search" className="menu-item">
            <Search className="icon" /> Tìm Kiếm
          </Link>
        </li>
        <li>
          <Link to="/settings" className="menu-item">
            <Settings className="icon" /> Cài Đặt
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
