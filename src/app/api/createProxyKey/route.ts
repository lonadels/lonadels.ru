import {NextResponse} from 'next/server';
import db from '@/lib/db';
import vpn from '@/lib/vpn';
import {headers} from 'next/headers';

export async function POST() {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for');

  if (!ip)
    return NextResponse.json({error: 'Can\'t get IP'}, {status: 400});

  const {accessUrl} = await vpn.createAccessKey();

  const device = await db.devices.upsert({
    where: {
      ip,
    },
    create: {
      ip,
    },
    update: {},
  });

  const key = await db.proxyKey.findFirst({
    where: {
      devices: {
        none: {
          id: device.id,
        },
      },
    },
  });

  const proxyKey = key && await db.proxyKey.update({
    where: {
      id: key.id,
    },
    data: {
      devices: {
        connect: {
          id: device.id,
        },
      },
    },
  }) || await db.proxyKey.create({
    data: {
      accessUrl,
      devices: {
        connect: {
          id: device.id,
        },
      },
    },
  });

  return NextResponse.json(proxyKey, {status: 200});
}
