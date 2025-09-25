import axios from 'axios';
import {CreateProxyKeyResponse, GetProxyKeyResponse} from '@/lib/types';

export const api = axios.create({
  // In the browser, a relative baseURL targets the same origin.
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function createProxyKey(): Promise<CreateProxyKeyResponse> {
  const res = await api.post<CreateProxyKeyResponse>('/api/keys');
  return res.data;
}

export async function getProxyKey(uuid: string): Promise<GetProxyKeyResponse> {
  const res = await api.get<GetProxyKeyResponse>(`/api/keys/${uuid}`);
  return res.data;
}
