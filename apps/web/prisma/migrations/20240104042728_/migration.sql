/*
  Warnings:

  - The `ingested` column on the `FeedEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FeedEntry" DROP COLUMN "ingested",
ADD COLUMN     "ingested" TIMESTAMP(3);
