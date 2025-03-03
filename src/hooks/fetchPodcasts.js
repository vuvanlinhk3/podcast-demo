import Parser from "rss-parser";

const parser = new Parser();

const fetchPodcasts = async () => {
  try {
    const response = await fetch("https://itunes.apple.com/search?term=startups&media=podcast&limit=50");
    if (!response.ok) throw new Error("Không thể lấy dữ liệu từ API");
    const data = await response.json();

    const groupedPodcasts = await Promise.all(
      data.results.map(async (podcast) => {
        const rss = await parser.parseURL(podcast.feedUrl);
        const episodes = rss.items.map((item) => ({
          title: item.title,
          audio: item.enclosure.url // URL audio thực tế từ RSS
        }));

        return {
          genre: podcast.primaryGenreName || "Khác",
          podcasts: [{
            id: podcast.collectionId,
            title: podcast.collectionName,
            description: `A podcast by ${podcast.artistName}`,
            image: podcast.artworkUrl600 || podcast.artworkUrl100,
            episodes
          }]
        };
      })
    );

    // Gộp các podcast theo genre
    const finalPodcasts = groupedPodcasts.reduce((acc, { genre, podcasts }) => {
      if (!acc[genre]) acc[genre] = { genre, podcasts: [] };
      acc[genre].podcasts.push(...podcasts);
      return acc;
    }, {});

    setPodcasts(Object.values(finalPodcasts));
    setLoading(false);
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};