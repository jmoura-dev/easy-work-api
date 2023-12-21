/*
  Warnings:

  - You are about to drop the column `user_id` on the `avatars` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avatar_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "avatars" DROP CONSTRAINT "avatars_user_id_fkey";

-- DropIndex
DROP INDEX "avatars_user_id_key";

-- AlterTable
ALTER TABLE "avatars" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "description",
ADD COLUMN     "about" TEXT,
ADD COLUMN     "avatar_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_avatar_id_key" ON "users"("avatar_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "avatars"("id") ON DELETE SET NULL ON UPDATE CASCADE;
