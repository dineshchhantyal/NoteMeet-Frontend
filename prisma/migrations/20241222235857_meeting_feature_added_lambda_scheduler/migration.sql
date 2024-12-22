-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "awsJobId" TEXT,
ADD COLUMN     "awsSchedulerArn" TEXT,
ADD COLUMN     "recordingUrl" TEXT,
ADD COLUMN     "summary" JSONB,
ADD COLUMN     "transcript" TEXT;
