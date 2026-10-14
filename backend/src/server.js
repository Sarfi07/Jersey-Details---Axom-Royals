import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient, Prisma } from "@prisma/client";
import entriesRouter from "./routes/entries.js";


const allowedOrigins = [
  `${process.env.CLIENT_ORIGIN}`,
  `${process.CLIENT_ORIGIN_LOCAL}`,
];


const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT) || 4000;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/entries", entriesRouter(prisma));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

const server = app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
