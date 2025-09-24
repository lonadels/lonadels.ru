import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { clearAllProxyKeys } from './service';

export async function POST() {
  const headersInstance = await headers();
  const apiKey = headersInstance.get('x-api-key');
  const expectedApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== expectedApiKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await clearAllProxyKeys();

  return NextResponse.json({ success: 1 }, { status: 200 });
}
