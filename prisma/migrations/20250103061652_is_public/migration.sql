/*
  Warnings:

  - You are about to drop the column `public` on the `subscription_plans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscription_plans" DROP COLUMN "public",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;
