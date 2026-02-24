import { prisma } from '@workspace/db'

class DedupService {
  async isDuplicate(
    galleryId: string,
    checksum: string,
  ): Promise<{ duplicate: boolean; existingPhotoId?: string }> {
    const photo = await prisma.photo.findFirst({
      where: {
        galleryId,
        checksum,
        status: {
          not: 'pending',
        },
      },
      select: {
        id: true,
      },
    })

    if (!photo) {
      return { duplicate: false }
    }

    return {
      duplicate: true,
      existingPhotoId: photo.id,
    }
  }

  async filterDuplicates(galleryId: string, checksums: string[]): Promise<Map<string, string>> {
    const normalized = Array.from(new Set(checksums.filter((checksum) => checksum.length > 0)))

    if (normalized.length === 0) {
      return new Map<string, string>()
    }

    const photos = await prisma.photo.findMany({
      where: {
        galleryId,
        checksum: {
          in: normalized,
        },
        status: {
          not: 'pending',
        },
      },
      select: {
        id: true,
        checksum: true,
      },
    })

    const map = new Map<string, string>()
    for (const photo of photos) {
      if (photo.checksum) {
        map.set(photo.checksum, photo.id)
      }
    }

    return map
  }
}

export const dedupService = new DedupService()
