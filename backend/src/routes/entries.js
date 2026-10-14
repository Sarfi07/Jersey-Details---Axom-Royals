import { Router } from "express";
import { Prisma } from "@prisma/client";

const jerseySizes = new Set(["S", "M", "L", "XL", "XXL"]);
const sleeves = new Set(["HALF", "FULL"]);

export default function entriesRouter(prisma) {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      const entries = await prisma.entry.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(entries);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    const fullName = typeof req.body.fullName === "string"
      ? req.body.fullName.trim().replace(/\s+/g, " ")
      : "";
    const jerseyName = typeof req.body.jerseyName === "string"
      ? req.body.jerseyName.trim().replace(/\s+/g, " ")
      : "";
    const jerseyNumber = Number(req.body.jerseyNumber);
    const jerseySize = req.body.jerseySize;
    const sleeve = req.body.sleeve;
    const pantWaist = typeof req.body.pantWaist === "string"
      ? req.body.pantWaist.trim()
      : String(req.body.pantWaist ?? "").trim();
    const pantLength = typeof req.body.pantLength === "string"
      ? req.body.pantLength.trim()
      : String(req.body.pantLength ?? "").trim();

    if (!fullName) {
      return res.status(400).json({ message: "Full Name of the player is required." });
    }

    if (!jerseyName) {
      return res.status(400).json({ message: "Name to print on the jersey is required." });
    }
    if (!Number.isInteger(jerseyNumber) || jerseyNumber < 0 || jerseyNumber > 999) {
      return res.status(400).json({ message: "Jersey number must be a whole number from 0 to 999." });
    }
    if (!jerseySizes.has(jerseySize)) {
      return res.status(400).json({ message: "Choose a valid jersey size." });
    }
    if (!sleeves.has(sleeve)) {
      return res.status(400).json({ message: "Choose Half or Full sleeve." });
    }
    if (!pantWaist || !pantLength) {
      return res.status(400).json({ message: "Track pant waist and length are required." });
    }
    if (pantWaist.length > 40 || pantLength.length > 40) {
      return res.status(400).json({ message: "Waist and length must each be 40 characters or fewer." });
    }

    try {
      const entry = await prisma.entry.create({
        data: {
          fullName,
          jerseyName,
          nameKey: jerseyName.toLocaleLowerCase("en-US"),
          jerseyNumber,
          jerseySize,
          sleeve,
          pantWaist,
          pantLength,
        },
      });
      return res.status(201).json({
        message: "Your entry has been saved successfully.",
        entry,
      });
    } catch (error) {
      // PostgreSQL's unique constraint is the final authority on duplicates,
      // including simultaneous requests.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return res.status(409).json({ message: "Your entry is already saved. Duplicate names are not allowed." });
      }
      return next(error);
    }
  });

  return router;
}
