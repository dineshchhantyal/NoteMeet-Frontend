/*
  Warnings:

  - You are about to drop the column `status` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE';
