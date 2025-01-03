/*
  Warnings:

  - A unique constraint covering the columns `[userId,planId,status]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subscription_userId_status_key";

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_planId_status_key" ON "Subscription"("userId", "planId", "status");
