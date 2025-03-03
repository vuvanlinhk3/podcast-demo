import { useState, useEffect } from "react";
import "../App.css";
import "../css/Seting.css"

function Settings() {
  const [theme, setTheme] = useState(() => {
    // Lấy theme từ localStorage nếu có, mặc định là "light"
    return localStorage.getItem("theme") || "light";
  });

  // Áp dụng theme vào body hoặc root element khi theme thay đổi
  useEffect(() => {
    document.body.className = `${theme}-theme`; // Thêm class vào body
    localStorage.setItem("theme", theme); // Lưu theme vào localStorage
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="settings-container">
      <h2>Cài Đặt</h2>
      <label className="theme-toggle">
        Chế độ tối:
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
      </label>
    </div>
  );
}

export default Settings;