-- CreateTable
CREATE TABLE "FeedEntryMedia" (
    "id" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "title" TEXT,
    "medium" TEXT,
    "height" TEXT,
    "width" TEXT,
    "feedEntryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedEntryMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeedEntryMedia_userId_idx" ON "FeedEntryMedia"("userId");

-- CreateIndex
CREATE INDEX "FeedEntryMedia_feedEntryId_idx" ON "FeedEntryMedia"("feedEntryId");
