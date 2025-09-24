import axios from 'axios';
import type { CreateProxyKeyResponse } from '@/lib/types';

export const api = axios.create({
  // In the browser, a relative baseURL targets the same origin.
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function createProxyKey(): Promise<CreateProxyKeyResponse> {
  const res = await api.post<CreateProxyKeyResponse>('/api/createProxyKey');
  return res.data;
}
