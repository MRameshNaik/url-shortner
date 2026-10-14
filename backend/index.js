import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5001;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 1. POST /api/shorten: Shorten a given URL
app.post("/api/shorten", async (req, res) => {
  try {
    let { originalUrl } = req.body;

    if (!originalUrl || typeof originalUrl !== "string") {
      return res.status(400).json({ message: "A valid URL is required." });
    }

    originalUrl = originalUrl.trim();

    // Ensure URL has a valid protocol
    if (!/^https?:\/\//i.test(originalUrl)) {
      originalUrl = `https://${originalUrl}`;
    }

    // Generate unique 8-character ID
    const shortId = nanoid(8);

    const newUrl = await prisma.url.create({
      data: {
        originalUrl,
        shortId,
      },
    });

    return res.status(201).json({
      id: newUrl.id,
      originalUrl: newUrl.originalUrl,
      shortId: newUrl.shortId,
      shortUrl: `${BASE_URL}/${newUrl.shortId}`,
      clicks: newUrl.clicks,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// 2. GET /:shortId: Redirect to the original URL and increment clicks
app.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    const urlRecord = await prisma.url.findUnique({
      where: { shortId },
    });

    if (!urlRecord) {
      return res.status(404).json({ message: "Short URL not found." });
    }

    // Increment click counter
    await prisma.url.update({
      where: { shortId },
      data: { clicks: { increment: 1 } },
    });

    return res.redirect(urlRecord.originalUrl);
  } catch (error) {
    console.error("Error handling redirection:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});