import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "../inngest/index.js";
import connectDB from "../configs/db.js";

const app = express();

// ⚠️ IMPORTANT: cache DB connection
let isConnected = false;

const initDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/", async (req, res) => {
  await initDB();
  res.send("Server is live on Vercel 🚀");
});

app.use(
  "/api/inngest",
  async (req, res, next) => {
    await initDB();
    next();
  },
  serve({ client: inngest, functions })
);

// ❌ NO app.listen
export default app;
