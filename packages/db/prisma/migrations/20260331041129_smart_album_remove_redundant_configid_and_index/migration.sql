/*
  Warnings:

  - You are about to drop the column `configId` on the `smart_album_design` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "smart_album_design" DROP CONSTRAINT "smart_album_design_configId_fkey";

-- DropIndex
DROP INDEX "smart_album_transaction_submissionId_idx";

-- AlterTable
ALTER TABLE "smart_album_design" DROP COLUMN "configId";
