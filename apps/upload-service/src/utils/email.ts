import { logger } from './logger'

export async function sendStorageWarningEmail(params: {
  to: string
  name?: string | null
  used: bigint
  limit: bigint
  percentage: number
  level: 80 | 95
  upgradeUrl: string
}): Promise<void> {
  const log = logger.child({ module: 'email.util' })

  // Backend owns rich templated mail today. Upload-service logs intent until
  // dedicated templates/sender are moved here.
  log.warn(
    {
      to: params.to,
      level: params.level,
      percentage: params.percentage,
      used: params.used.toString(),
      limit: params.limit.toString(),
      upgradeUrl: params.upgradeUrl,
    },
    'Storage warning email dispatch is not yet configured in upload-service',
  )
}
