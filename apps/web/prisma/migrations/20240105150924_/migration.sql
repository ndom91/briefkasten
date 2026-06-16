/*
  Warnings:

  - You are about to drop the column `description` on the `FeedEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "guid" TEXT;

-- AlterTable
ALTER TABLE "FeedEntry" DROP COLUMN "description",
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "content" TEXT,
ADD COLUMN     "contentSnippet" TEXT,
ADD COLUMN     "published" TIMESTAMP(3);
