/*
  Warnings:

  - You are about to drop the column `available_for_contact` on the `Developer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Developer" DROP COLUMN "available_for_contact",
ADD COLUMN     "available_for_contract" BOOLEAN DEFAULT false;
