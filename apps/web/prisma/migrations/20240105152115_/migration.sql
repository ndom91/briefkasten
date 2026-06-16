/*
  Warnings:

  - You are about to drop the column `guid` on the `Feed` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feed" DROP COLUMN "guid";

-- AlterTable
ALTER TABLE "FeedEntry" ADD COLUMN     "guid" TEXT;
