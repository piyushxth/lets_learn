-- DropIndex
DROP INDEX "Category_name_key";
CREATE UNIQUE INDEX "Category_name_active_unique"
ON "Category" ("name")
WHERE "deleted_at" IS NULL;