import {NextResponse} from 'next/server';
import db from '@/lib/db';
import vpn from '@/lib/vpn';
import {AccessKey} from 'outlinevpn-api';
import {headers} from 'next/headers';

export async function POST() {
  const headersInstance = await headers();
  const apiKey = headersInstance.get('x-api-key');
  const expectedApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== expectedApiKey) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  const keys = (await vpn.getAccessKeys()) as unknown as { accessKeys: AccessKey[] };

  for (const key of keys.accessKeys) {
    await vpn.deleteAccessKey(key.id);
  }

  await db.proxyKey.deleteMany({
    where: {
      accessUrl: {
        in: keys.accessKeys.map(key => key.accessUrl),
      },
    },
  });

  return NextResponse.json({success: 1}, {status: 200});
}
