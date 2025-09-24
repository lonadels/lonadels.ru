import {NextResponse} from 'next/server';
import db from '@/lib/db';
import vpn from '@/lib/vpn';
import {headers} from 'next/headers';
import {isValidIP} from '@/lib/utils';

export async function POST() {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for');

  if (!isValidIP(ip))
    return NextResponse.json({error: 'Invalid or missing IP address'}, {status: 400});

  if (ip === process.env.HOST_IP!)
    return NextResponse.json({error: 'Please, disable VPN first'}, {status: 400});

  const device = await db.devices.upsert({
    where: {ip},
    create: {ip},
    update: {},
  });

  let proxyKey = await db.proxyKey.findFirst({
    where: {
      devices: {
        none: {
          id: device.id,
        },
      },
    },
  });

  if (proxyKey) {
    proxyKey = await db.proxyKey.update({
      where: {id: proxyKey.id},
      data: {
        devices: {
          connect: {id: device.id},
        },
      },
    });
  } else {
    const {accessUrl} = await vpn.createAccessKey();

    proxyKey = await db.proxyKey.create({
      data: {
        accessUrl,
        devices: {
          connect: {id: device.id},
        },
      },
    });
  }

  return NextResponse.json(proxyKey, {status: 200});
}
