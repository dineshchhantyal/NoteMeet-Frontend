/*
  Warnings:

  - A unique constraint covering the columns `[email,isRead]` on the table `ContactMessage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ContactMessage_email_key";

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "ContactMessage_email_isRead_key" ON "ContactMessage"("email", "isRead");
