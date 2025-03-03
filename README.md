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
app.use(cors()); // Enable CORS for all origins

app.get("/proxy", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send("Missing URL parameter");
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0", // Mimic a browser request
        "Accept": "application/rss+xml, application/xml, text/xml"
      }
    });

    if (!response.ok) {
      throw new Error(`Server Error (${response.status}): ${response.statusText}`);
    }

    const text = await response.text();
    res.set("Content-Type", "application/xml"); // Set RSS format
    res.send(text);
  } catch (err) {
    res.status(500).send("Error fetching RSS: " + err.message);
  }
});

app.listen(5000, () => console.log("✅ Proxy server running on port 5000"));
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

