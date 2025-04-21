require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  status: String, // e.g., "read", "reading", "want to read"
});
const Book = mongoose.model("Book", BookSchema);

// CRUD endpoints
app.get("/books", async (req, res) => res.json(await Book.find()));
app.post("/books", async (req, res) => res.json(await Book.create(req.body)));
app.put("/books/:id", async (req, res) =>
  res.json(await Book.findByIdAndUpdate(req.params.id, req.body))
);
app.delete("/books/:id", async (req, res) =>
  res.json(await Book.findByIdAndDelete(req.params.id))
);

app.listen(3000, () => console.log("Server running on port 3000"));
