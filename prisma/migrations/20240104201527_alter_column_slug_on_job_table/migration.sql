/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `jobs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jobs_slug_key" ON "jobs"("slug");
