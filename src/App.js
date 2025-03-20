import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home.js";
import Search from "./pages/Search.js";
import PodcastDetail from "./pages/PodcastDetail.js";
import Settings from "./pages/Settings.js";
import Sidebar from "./components/Sidebar.js";
import ModelPlay from "./components/ModelPlay.js";

function App() {
  const [currentPodcast, setCurrentPodcast] = useState(null);

  const handlePlayPodcast = (podcast) => {
    setCurrentPodcast(podcast);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home handlePlayPodcast={handlePlayPodcast} />} />
            <Route path="/search" element={<Search />} />
            <Route path="/podcast/:id" element={<PodcastDetail handlePlayPodcast={handlePlayPodcast}/>} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        {currentPodcast && <ModelPlay currentPodcast={currentPodcast} />}
      </div>
    </Router>
  );
}

export default App;
