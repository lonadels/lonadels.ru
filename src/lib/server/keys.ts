import { findProxyKeyByUuid } from '@/app/api/keys/repository';
import type { GetProxyKeyResponse } from '@/lib/types';

export async function getProxyKeyFromDB(uuid: string): Promise<GetProxyKeyResponse> {
  const row = await findProxyKeyByUuid(uuid);
  if (!row) {
    throw new Error('Invalid proxy key uuid');
  }
  return {
    accessUrl: row.accessUrl,
    createdAt: row.createdAt as unknown as Date,
  } satisfies GetProxyKeyResponse;
}
