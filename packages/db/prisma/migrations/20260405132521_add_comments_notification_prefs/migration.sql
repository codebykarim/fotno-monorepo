-- AlterTable
ALTER TABLE "notification_preference" ADD COLUMN     "commentsBrowser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "commentsEmail" BOOLEAN NOT NULL DEFAULT false;
