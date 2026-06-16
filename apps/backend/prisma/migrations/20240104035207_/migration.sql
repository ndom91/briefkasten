/*
  Warnings:

  - The `width` column on the `FeedEntryMedia` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FeedEntryMedia" DROP COLUMN "width",
ADD COLUMN     "width" INTEGER,
ALTER COLUMN "medium" SET DATA TYPE TEXT;
