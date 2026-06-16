-- AlterTable
ALTER TABLE "FeedEntry" ADD COLUMN     "title_idx" tsvector DEFAULT ''::tsvector;
