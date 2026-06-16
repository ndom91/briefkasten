/*
  Warnings:

  - You are about to drop the column `title_idx` on the `FeedEntry` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Bookmark_desc_idx";

-- DropIndex
DROP INDEX "Bookmark_title_idx";

-- DropIndex
DROP INDEX "Bookmark_url_idx";

-- DropIndex
DROP INDEX "FeedEntry_contentSnippet_idx";

-- DropIndex
DROP INDEX "FeedEntry_title_idx";

-- AlterTable
ALTER TABLE "FeedEntry" DROP COLUMN "title_idx";
