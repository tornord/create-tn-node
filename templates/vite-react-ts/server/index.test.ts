import request from "supertest";

import { app } from "./index.js";

describe("server", () => {
  it("POST /api/search responds with { ok: true }", async () => {
    const response = await request(app).post("/api/search").send({});

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.body).toEqual({ ok: true });
  });

  it("returns 404 for unknown API routes", async () => {
    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
  });
});
