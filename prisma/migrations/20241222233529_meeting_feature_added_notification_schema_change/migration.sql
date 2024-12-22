/*
  Warnings:

  - A unique constraint covering the columns `[meetingId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification_meetingId_key" ON "Notification"("meetingId");
