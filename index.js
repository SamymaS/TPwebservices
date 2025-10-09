import express from "express";
import postsRouter from "./api/posts.js";
import adminRouter from "./api/admin.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", postsRouter);
app.use("/api", adminRouter);

// Basic healthcheck
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
