-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modifiedBy" TEXT,
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;
