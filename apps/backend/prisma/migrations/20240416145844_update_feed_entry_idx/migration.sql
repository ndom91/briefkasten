-- DropIndex
DROP INDEX "FeedEntry_content_idx";

-- DropIndex
DROP INDEX "TagsOnBookmarks_bookmarkId_idx";

-- DropIndex
DROP INDEX "TagsOnBookmarks_tagId_idx";

-- CreateIndex
CREATE INDEX "FeedEntry_contentSnippet_idx" ON "FeedEntry" USING GIN ("contentSnippet" gin_trgm_ops);
