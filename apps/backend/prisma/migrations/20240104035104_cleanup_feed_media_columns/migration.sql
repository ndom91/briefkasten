/*
  Warnings:

  - The `medium` column on the `FeedEntryMedia` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `height` column on the `FeedEntryMedia` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FeedEntryMedia" DROP COLUMN "medium",
ADD COLUMN     "medium" INTEGER,
DROP COLUMN "height",
ADD COLUMN     "height" INTEGER;
