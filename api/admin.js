import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// Health for admin scope
router.get("/admin/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Reset all demo tables (demo_posts, demo_comments, demo_likes)
router.post("/admin/reset", async (req, res) => {
  const tables = ["demo_likes", "demo_comments", "demo_posts"]; // delete in fk-safe order
  try {
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .not("id", "is", null); // Supabase: DELETE requires a WHERE clause
      if (error) {
        return res.status(500).json({ error: error.message, table });
      }
    }
    res.status(200).json({ reset: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Seed demo data (demo_*)
router.post("/admin/seed", async (req, res) => {
  try {
    const demoPosts = [
      {
        title: "Hello Supabase",
        content: "Premier article seedé",
        is_published: true,
        published_at: new Date().toISOString(),
      },
      {
        title: "Brouillon en attente",
        content: "Contenu à publier plus tard",
        is_published: false,
        published_at: null,
      },
    ];

    const { data: posts, error: postsError } = await supabase
      .from("demo_posts")
      .insert(demoPosts)
      .select("id");
    if (postsError) return res.status(500).json({ error: postsError.message });

    const [firstPostId] = posts?.map((p) => p.id) ?? [];

    if (firstPostId) {
      const { error: commentsError } = await supabase
        .from("demo_comments")
        .insert([
          { post: firstPostId, content: "Super article !" },
          { post: firstPostId, content: "Merci pour l'info" },
        ]);
      if (commentsError)
        return res.status(500).json({ error: commentsError.message });

      const { error: likesError } = await supabase
        .from("demo_likes")
        .insert([{ post: firstPostId }, { post: firstPostId }]);
      if (likesError) return res.status(500).json({ error: likesError.message });
    }

    res.status(201).json({ seeded: true, posts_created: posts?.length ?? 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Generate random data (n posts with comments and likes) on demo_*
router.post("/admin/generate", async (req, res) => {
  const count = Number(req.body?.count ?? 3);
  if (!Number.isFinite(count) || count < 1 || count > 20) {
    return res.status(400).json({ error: "count must be 1..20" });
  }
  try {
    const now = Date.now();
    const postsToInsert = Array.from({ length: count }).map((_, i) => ({
      title: `Post ${i + 1} - ${now}`,
      content: `Contenu auto #${i + 1}`,
      is_published: i % 2 === 0,
      published_at: i % 2 === 0 ? new Date().toISOString() : null,
    }));
    const { data: createdPosts, error: pErr } = await supabase
      .from("demo_posts")
      .insert(postsToInsert)
      .select("id");
    if (pErr) return res.status(500).json({ error: pErr.message });

    for (const p of createdPosts) {
      const { error: cErr } = await supabase.from("demo_comments").insert([
        { post: p.id, content: "Auto c1" },
        { post: p.id, content: "Auto c2" },
      ]);
      if (cErr) return res.status(500).json({ error: cErr.message });
      const { error: lErr } = await supabase
        .from("demo_likes")
        .insert([{ post: p.id }, { post: p.id }]);
      if (lErr) return res.status(500).json({ error: lErr.message });
    }
    res.status(201).json({ generated: createdPosts.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Diagnostics: vérifie la connexion Supabase et liste 1 post
router.get("/admin/diagnostics", async (req, res) => {
  try {
    const { data, error } = await supabase.from("demo_posts").select("id").limit(1);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ ok: true, sample: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;


