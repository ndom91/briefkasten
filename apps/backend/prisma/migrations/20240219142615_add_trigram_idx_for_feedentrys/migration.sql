-- CreateIndex
CREATE INDEX "FeedEntry_title_idx" ON "FeedEntry" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "FeedEntry_content_idx" ON "FeedEntry" USING GIN ("content" gin_trgm_ops);
