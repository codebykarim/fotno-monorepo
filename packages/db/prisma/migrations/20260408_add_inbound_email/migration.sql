-- CreateTable
CREATE TABLE "inbound_email" (
    "id" TEXT NOT NULL,
    "resendId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT[],
    "cc" TEXT[],
    "bcc" TEXT[],
    "subject" TEXT NOT NULL,
    "text" TEXT,
    "html" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isStarred" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inbound_email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inbound_email_resendId_key" ON "inbound_email"("resendId");

-- CreateIndex
CREATE INDEX "inbound_email_isRead_createdAt_idx" ON "inbound_email"("isRead", "createdAt");
