import express from "express";
import postsRouter from "./api/posts.js";

const app = express();

app.use(express.json());
app.use("/api", postsRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
