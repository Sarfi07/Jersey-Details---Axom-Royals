-- CreateEnum
CREATE TYPE "JerseySize" AS ENUM ('S', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "Sleeve" AS ENUM ('HALF', 'FULL');

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "jerseyName" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "jerseyNumber" INTEGER NOT NULL,
    "jerseySize" "JerseySize" NOT NULL,
    "sleeve" "Sleeve" NOT NULL,
    "pantWaist" TEXT NOT NULL,
    "pantLength" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry_nameKey_key" ON "Entry"("nameKey");

-- CreateIndex
CREATE INDEX "Entry_createdAt_idx" ON "Entry"("createdAt");
