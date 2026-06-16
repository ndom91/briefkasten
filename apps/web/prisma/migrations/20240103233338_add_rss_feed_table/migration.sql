-- CreateTable
CREATE TABLE "Feed" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feed_userId_idx" ON "Feed"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Feed_url_userId_key" ON "Feed"("url", "userId");
