import path from "node:path";

import cors from "cors";
import express from "express";

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? "3000", 10) || 3000;
const DIST_PATH = path.resolve("./dist");

app.use(cors());
app.use(express.json());
app.use(express.static(DIST_PATH));
// eslint-disable-next-line new-cap
const router = express.Router();

app.use("/api", router);

router.post("/search", (req: express.Request, res: express.Response) => {
  res.json({ ok: true });
});

// Add routes here

app.get("/*path", (_req: express.Request, res: express.Response) => {
  res.sendFile(path.join(DIST_PATH, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // eslint-disable-line no-console
});
