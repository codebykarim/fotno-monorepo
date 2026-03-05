import { prisma } from "@workspace/db";

export const db = prisma as any;

export const bigIntToString = (value: bigint | number | null | undefined): string => {
  if (value === null || value === undefined) return "0";
  return String(value);
};

export const toIsoOrNull = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value !== "string" || value.trim().length === 0) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};
