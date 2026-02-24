import { CHUNK_SIZE_BYTES } from '../constants/upload'

export function calculateTotalParts(sizeBytes: number): number {
  return Math.max(1, Math.ceil(sizeBytes / CHUNK_SIZE_BYTES))
}

export function buildPartNumbers(totalParts: number): number[] {
  return Array.from({ length: totalParts }, (_, index) => index + 1)
}

export function findMissingPartNumbers(
  totalParts: number,
  completedPartNumbers: number[],
): number[] {
  const completed = new Set(completedPartNumbers)
  return buildPartNumbers(totalParts).filter((part) => !completed.has(part))
}
