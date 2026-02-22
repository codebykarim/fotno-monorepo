/*
  Warnings:

  - Added the required column `status` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');

-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "status" "SubscriptionStatus" NOT NULL;
