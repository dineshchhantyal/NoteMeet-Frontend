-- CreateEnum
CREATE TYPE "SharePermission" AS ENUM ('VIEW', 'EDIT', 'ADMIN');

-- CreateTable
CREATE TABLE "meeting_shares" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "permission" "SharePermission" NOT NULL DEFAULT 'VIEW',
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAccessAt" TIMESTAMP(3),

    CONSTRAINT "meeting_shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meeting_shares_token_key" ON "meeting_shares"("token");

-- CreateIndex
CREATE INDEX "meeting_shares_meetingId_idx" ON "meeting_shares"("meetingId");

-- CreateIndex
CREATE INDEX "meeting_shares_token_idx" ON "meeting_shares"("token");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_shares_meetingId_email_key" ON "meeting_shares"("meetingId", "email");

-- AddForeignKey
ALTER TABLE "meeting_shares" ADD CONSTRAINT "meeting_shares_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
