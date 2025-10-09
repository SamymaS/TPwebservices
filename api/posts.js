import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

router.get("/posts", async (req, res) => {
  // Get all posts from the database
  let query = supabase.from("demo_posts").select("*");

  // Filter only published posts
  if (req.query.is_published === "true") {
    query = query.eq("is_published", true);
  }

  // simple search by title contains
  if (req.query.q && req.query.q.length >= 2) {
    query = query.ilike("title", `%${req.query.q}%`);
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
  const { data, error } = await supabase.from("demo_posts").insert(body);

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// Get post by id
router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("demo_posts").select("*").eq("id", id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.status(200).json(data);
});

router.patch("/posts/:id/publish", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("demo_posts")
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(204).json(data);
});

// Update post (title/content)
router.patch("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const updates = {};
  if (typeof req.body.title === "string") updates.title = req.body.title;
  if (typeof req.body.content === "string") updates.content = req.body.content;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  const { data, error } = await supabase.from("demo_posts").update(updates).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// Delete post
router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params; // UUID

  const { error: likesError } = await supabase.from("demo_likes").delete().eq("post", id);
  if (likesError) return res.status(500).json({ error: likesError.message });

  const { error: commentsError } = await supabase
    .from("demo_comments")
    .delete()
    .eq("post", id);
  if (commentsError) return res.status(500).json({ error: commentsError.message });

  const { error: postError } = await supabase.from("demo_posts").delete().eq("id", id);
  if (postError) return res.status(500).json({ error: postError.message });
  res.status(204).send();
});

// Comments related routes
router.get("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("demo_comments")
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

  const { data, error } = await supabase
    .from("demo_comments")
    .insert(body)
    .select("id");

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// Delete a comment by id
router.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params; // UUIDs
  const { error } = await supabase
    .from("demo_comments")
    .delete()
    .eq("id", commentId)
    .eq("post", postId);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// Likes related routes
router.get("/posts/:id/likes-count", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("demo_likes")
    .select("*")
    .eq("post", id);
  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(200).json(data.length);
});

router.post("/posts/:id/likes", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("demo_likes")
    .insert({ post: id })
    .select("id");

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// List likes for a post
router.get("/posts/:id/likes", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("demo_likes")
    .select("id, post")
    .eq("post", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// Delete a like by id for a post
router.delete("/posts/:postId/likes/:likeId", async (req, res) => {
  const { postId, likeId } = req.params; // UUIDs
  const { error } = await supabase
    .from("demo_likes")
    .delete()
    .eq("id", likeId)
    .eq("post", postId);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;
