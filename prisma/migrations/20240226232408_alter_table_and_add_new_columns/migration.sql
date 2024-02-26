/*
  Warnings:

  - You are about to drop the column `slug` on the `jobs` table. All the data in the column will be lost.
  - Added the required column `hoursPerWeek` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remuneration` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workMode` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workSchedule` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "jobs_slug_key";

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "slug",
ADD COLUMN     "hoursPerWeek" INTEGER NOT NULL,
ADD COLUMN     "remuneration" INTEGER NOT NULL,
ADD COLUMN     "workMode" TEXT NOT NULL,
ADD COLUMN     "workSchedule" TEXT NOT NULL;
