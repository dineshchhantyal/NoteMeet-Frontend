/*
  Warnings:

  - The `status` column on the `JobApplication` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "JobApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "status",
ADD COLUMN     "status" "JobApplicationStatus" NOT NULL DEFAULT 'PENDING';
