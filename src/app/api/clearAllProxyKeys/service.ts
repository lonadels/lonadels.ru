import vpn from '@/lib/vpn';
import type { AccessKey } from 'outlinevpn-api';
import { deleteProxyKeysByAccessUrls } from './repository';

export async function clearAllProxyKeys(): Promise<void> {
  const keys = (await vpn.getAccessKeys()) as unknown as { accessKeys: AccessKey[] };

  for (const key of keys.accessKeys) {
    await vpn.deleteAccessKey(key.id);
  }

  const urls = keys.accessKeys.map((key) => key.accessUrl);
  if (urls.length > 0) {
    await deleteProxyKeysByAccessUrls(urls);
  }
}
