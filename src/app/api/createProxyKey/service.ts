import vpn from '@/lib/vpn';
import {isValidIP} from '@/lib/utils';
import type {ProxyKey} from '@prisma/client';
import { HttpError } from '@/lib/httpError';
import {
  connectDeviceToProxyKey,
  createProxyKeyWithDevice,
  findAvailableProxyKeyForDevice,
  upsertDevice,
} from './repository';

export async function createProxyKeyForIp(ip: string | null): Promise<ProxyKey> {
  if (!isValidIP(ip))
    throw new HttpError(400, 'Invalid or missing IP address');

  if (ip === process.env.HOST_IP)
    throw new HttpError(403, 'Requests from VPN are not allowed');

  const device = await upsertDevice(ip);

  let proxyKey = await findAvailableProxyKeyForDevice(device.id);

  if (proxyKey) {
    proxyKey = await connectDeviceToProxyKey(proxyKey.id, device.id);
  } else {
    const {accessUrl} = await vpn.createAccessKey();
    proxyKey = await createProxyKeyWithDevice(accessUrl, device.id);
  }

  return proxyKey;
}
