/*
  Warnings:

  - You are about to drop the column `cnpj` on the `companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "cnpj";

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "social_media" TEXT[];
