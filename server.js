require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect to MongoDB (Cosmos DB with Mongo API)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Root route for testing
app.get("/", (req, res) => {
  res.send("📚 Book Tracker API is live!");
});

// Define book schema and model
const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  status: String, // e.g., "read", "reading", "want to read"
});
const Book = mongoose.model("Book", BookSchema);

// CRUD API endpoints
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.post("/books", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: "Failed to add book" });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: "Failed to update book" });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: "Failed to delete book" });
  }
});

// Azure-compatible port binding
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
