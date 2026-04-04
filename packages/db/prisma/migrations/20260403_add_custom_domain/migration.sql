-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED');

-- CreateTable
CREATE TABLE "custom_domain" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "status" "DomainStatus" NOT NULL DEFAULT 'PENDING',
    "verificationToken" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custom_domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "custom_domain_userId_key" ON "custom_domain"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "custom_domain_domain_key" ON "custom_domain"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "custom_domain_verificationToken_key" ON "custom_domain"("verificationToken");

-- AddForeignKey
ALTER TABLE "custom_domain" ADD CONSTRAINT "custom_domain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
