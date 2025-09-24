import db from '@/lib/db';
import type { ProxyKey, Devices } from '@prisma/client';

export async function upsertDevice(ip: string): Promise<Devices> {
  return db.devices.upsert({
    where: { ip },
    create: { ip },
    update: {},
  });
}

export async function findAvailableProxyKeyForDevice(deviceId: number): Promise<ProxyKey | null> {
  return db.proxyKey.findFirst({
    where: {
      devices: {
        none: {
          id: deviceId,
        },
      },
    },
  });
}

export async function connectDeviceToProxyKey(proxyKeyId: number, deviceId: number): Promise<ProxyKey> {
  return db.proxyKey.update({
    where: { id: proxyKeyId },
    data: {
      devices: {
        connect: { id: deviceId },
      },
    },
  });
}

export async function createProxyKeyWithDevice(accessUrl: string, deviceId: number): Promise<ProxyKey> {
  return db.proxyKey.create({
    data: {
      accessUrl,
      devices: {
        connect: { id: deviceId },
      },
    },
  });
}
