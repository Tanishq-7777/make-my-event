import cors from "cors";
import express from "express";

export const app = express();
app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000", credentials: true }));
app.use(express.json());
app.get("/api/v1/health", (_request, response) => response.json({ data: { status: "ok" } }));
