import axios from 'axios';
import type { ProxyKey } from '@prisma/client';

export const api = axios.create({
  // In the browser, a relative baseURL targets the same origin.
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function createProxyKey(): Promise<ProxyKey> {
  const res = await api.post<ProxyKey>('/api/createProxyKey');
  return res.data;
}
