/*
  Warnings:

  - Made the column `hoursPerWeek` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `remuneration` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workMode` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workSchedule` on table `jobs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "jobs" ALTER COLUMN "hoursPerWeek" SET NOT NULL,
ALTER COLUMN "remuneration" SET NOT NULL,
ALTER COLUMN "workMode" SET NOT NULL,
ALTER COLUMN "workSchedule" SET NOT NULL;
