-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[];
