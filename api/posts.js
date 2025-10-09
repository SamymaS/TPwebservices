import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

router.get("/posts", async (req, res) => {
  // Get all posts from the database
  let query = supabase.from("posts").select("*");

  // Filter only published posts
  if (req.query.is_published === "true") {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});

router.post("/posts", async (req, res) => {
  const body = {
    title: req.body.title,
    content: req.body.content,
    is_published: false,
  };

  // Validate the body
  if (!body.title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  if (!body.content) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  // Create a new post in the database
  const { data, error } = await supabase.from("posts").insert(body);

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

router.patch("/posts/:id/publish", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("posts")
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(204).json(data);
});

// Comments related routes
router.get("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post", id);

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});

router.post("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;

  const body = {
    post: id,
    content: req.body.content,
  };

  if (!body.content || body.content.length < 2 || body.content.length > 280) {
    res.status(400).json({
      error: "Content is required and must be between 2 and 280 characters",
    });
    return;
  }

  const { data, error } = await supabase.from("comments").insert(body);

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// Likes related routes
router.get("/posts/:id/likes-count", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("post", id);
  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(200).json(data.length);
});

router.post("/posts/:id/likes", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("likes").insert({
    post: id,
  });

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

export default router;
