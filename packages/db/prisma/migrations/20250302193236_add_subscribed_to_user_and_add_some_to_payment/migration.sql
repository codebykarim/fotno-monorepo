/*
  Warnings:

  - You are about to drop the column `description` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount_cents` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initial_transaction` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "amount_cents" INTEGER NOT NULL,
ADD COLUMN     "initial_transaction" INTEGER NOT NULL,
ADD COLUMN     "transactionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "subscribed" BOOLEAN;

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactionId_key" ON "payment"("transactionId");
