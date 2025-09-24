import db from '@/lib/db';
import type { Prisma } from '@prisma/client';

export async function deleteProxyKeysByAccessUrls(urls: string[]): Promise<Prisma.BatchPayload> {
  return db.proxyKey.deleteMany({
    where: {
      accessUrl: {
        in: urls,
      },
    },
  });
}
