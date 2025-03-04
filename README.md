# Proxy Server for Fetching RSS Feeds

This project sets up a simple proxy server using **Express**, **Node-Fetch**, and **CORS** to bypass CORS restrictions when fetching RSS feeds.

## 📌 Installation

Run the following command to install the required dependencies:
```sh
npm install express node-fetch cors
```

## 🚀 Setting Up the Server

1. Create a file named `server.js` and paste the following code:

```js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Cấu hình CORS (cho phép localhost trong dev)
app.use(
  cors({
    origin: "http://localhost:3000", // Chỉ cho phép origin từ React app
  })
);

app.get("/proxy", async (req, res) => {
  const url = req.query.url;

  // Kiểm tra URL
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Thiếu hoặc URL không hợp lệ" });
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "audio/mpeg, application/octet-stream", // Hỗ trợ tệp âm thanh
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi từ server (${response.status}): ${response.statusText}`);
    }

    // Lấy Content-Type từ server gốc
    const contentType = response.headers.get("Content-Type") || "audio/mpeg";
    res.set("Content-Type", contentType);

    // Stream dữ liệu âm thanh trực tiếp
    response.body.pipe(res);
  } catch (err) {
    console.error("Lỗi proxy:", err);
    res.status(500).json({ error: "Lỗi fetch dữ liệu: " + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
```

## 🏃 Running the Server

Start the proxy server with:
```sh
node server.js
```

The server will be running on:
```
http://localhost:5000/proxy?url=YOUR_RSS_FEED_URL
```

## 📡 Example Request

To fetch an RSS feed, make a request like this:
```
http://localhost:5000/proxy?url=https://feeds.soundcloud.com/users/soundcloud:users:256509984/sounds.rss
```

## 🔧 Troubleshooting

- Ensure **Node.js** is installed.
- If you get a CORS error, confirm that the proxy is running on port **5000**.
- Check the server logs for detailed errors.

## 📜 License
This project is open-source and free to use.

---

Enjoy coding! 🚀

