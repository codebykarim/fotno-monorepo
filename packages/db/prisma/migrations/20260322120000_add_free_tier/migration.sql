-- AlterEnum (must be committed separately from usage)
ALTER TYPE "Plan" ADD VALUE IF NOT EXISTS 'FREE' BEFORE 'TRIAL';
