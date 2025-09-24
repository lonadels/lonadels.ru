import vpn from '@/lib/vpn';
import type { AccessKey } from 'outlinevpn-api';
import { deleteProxyKeysByAccessUrls } from './repository';

export async function clearAllProxyKeys(): Promise<void> {
  const {accessKeys} = (await vpn.getAccessKeys()) as unknown as { accessKeys: AccessKey[] };

  const deletions = accessKeys.map(k => vpn.deleteAccessKey(k.id));
  await Promise.allSettled(deletions);

  const urls = accessKeys.map((key) => key.accessUrl);
  if (urls.length > 0) {
    await deleteProxyKeysByAccessUrls(urls);
  }
}
