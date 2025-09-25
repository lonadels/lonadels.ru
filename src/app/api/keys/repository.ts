import db from '@/lib/db';
import type { ProxyKey, Devices, Prisma } from '@prisma/client';

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

export async function findProxyKeyByUuid(uuid: string): Promise<ProxyKey | null> {
  return db.proxyKey.findUnique({
    where: {
      uuid
    }
  });
}

export async function connectDeviceToProxyKey(proxyKeyId: string, deviceId: number): Promise<ProxyKey> {
  return db.proxyKey.update({
    where: { id: proxyKeyId },
    data: {
      devices: {
        connect: { id: deviceId },
      },
    },
  });
}

export async function createProxyKeyWithDevice(id: string, accessUrl: string, deviceId: number): Promise<ProxyKey> {
  return db.proxyKey.create({
    data: {
      id,
      accessUrl,
      devices: {
        connect: { id: deviceId },
      },
    },
  });
}

export async function deleteProxyKeysByIds(ids: string[]): Promise<Prisma.BatchPayload> {
  return db.proxyKey.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}
