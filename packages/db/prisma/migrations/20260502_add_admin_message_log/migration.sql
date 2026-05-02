-- CreateTable
CREATE TABLE "admin_message_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sentByUserId" TEXT,
    "preset" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "promoCode" TEXT,
    "featureName" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_message_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_message_log_userId_sentAt_idx" ON "admin_message_log"("userId", "sentAt");

-- AddForeignKey
ALTER TABLE "admin_message_log" ADD CONSTRAINT "admin_message_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_message_log" ADD CONSTRAINT "admin_message_log_sentByUserId_fkey" FOREIGN KEY ("sentByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
