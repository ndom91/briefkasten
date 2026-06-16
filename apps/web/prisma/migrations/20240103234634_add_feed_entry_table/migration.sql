-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "modified" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "FeedEntry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "copyright" TEXT,
    "modified" TIMESTAMP(3),
    "feedId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeedEntry_userId_idx" ON "FeedEntry"("userId");

-- CreateIndex
CREATE INDEX "FeedEntry_feedId_idx" ON "FeedEntry"("feedId");
