import {connectDeviceToProxyKey, findProxyKeyByUuid, upsertDevice} from '@/app/api/keys/repository';
import type { GetProxyKeyResponse } from '@/lib/types';
import {extractClientIp, isValidIP} from '@/lib/utils';
import {headers} from 'next/headers';
import HttpError from '@/lib/httpError';

export async function getProxyKeyFromDB(uuid: string): Promise<GetProxyKeyResponse> {
  const headersList = await headers();
  const ip = extractClientIp(headersList);

  if (!isValidIP(ip))
    throw new HttpError(400, 'Invalid or missing IP address');

  const row = await findProxyKeyByUuid(uuid);

  if (!row) {
    throw new Error('Invalid proxy key uuid');
  }

  if (ip !== process.env.HOST_IP) {
    const device = await upsertDevice(ip);
    await connectDeviceToProxyKey(row.id, device.id);
  }

  return {
    accessUrl: row.accessUrl,
    createdAt: row.createdAt as unknown as Date,
  } satisfies GetProxyKeyResponse;
}
