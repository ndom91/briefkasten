/*
  Warnings:

  - You are about to drop the column `modified` on the `FeedEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeedEntry" DROP COLUMN "modified",
ADD COLUMN     "author" TEXT,
ADD COLUMN     "ingested" INTEGER;
