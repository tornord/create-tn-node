import path from "path";

import cors from "cors";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_PATH = path.resolve("./dist");

app.use(cors());
app.use(express.json());
app.use(express.static(DIST_PATH));
const router = express.Router(); // eslint-disable-line new-cap

app.use("/api", router);

router.post("/search", (req, res) => {
  res.json({ ok: true });
});

// Add routes here

app.get("/*", (_req, res) => {
  res.sendFile(path.join(DIST_PATH, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // eslint-disable-line no-console
});
