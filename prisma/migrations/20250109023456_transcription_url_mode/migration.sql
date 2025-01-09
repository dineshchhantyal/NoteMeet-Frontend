/*
  Warnings:

  - You are about to drop the column `transcript` on the `Meeting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "transcript",
ADD COLUMN     "transcriptKey" TEXT,
ADD COLUMN     "transcriptUrl" TEXT;
