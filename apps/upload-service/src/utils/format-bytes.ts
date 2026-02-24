const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

export function formatBytes(value: bigint): string {
  if (value <= 0n) {
    return '0 B'
  }

  let scaled = Number(value)
  let unitIndex = 0

  while (scaled >= 1024 && unitIndex < UNITS.length - 1) {
    scaled /= 1024
    unitIndex += 1
  }

  const fractionDigits = unitIndex === 0 ? 0 : 1
  return `${scaled.toFixed(fractionDigits)} ${UNITS[unitIndex]}`
}
