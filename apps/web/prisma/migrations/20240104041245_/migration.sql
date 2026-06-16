/*
  Warnings:

  - You are about to drop the column `modified` on the `Feed` table. All the data in the column will be lost.
  - You are about to drop the column `copyright` on the `FeedEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feed" DROP COLUMN "modified",
ADD COLUMN     "lastFetched" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FeedEntry" DROP COLUMN "copyright";
