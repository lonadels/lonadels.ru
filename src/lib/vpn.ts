import {OutlineVPN} from 'outlinevpn-api';
import { env } from '@/lib/env';

const client = new OutlineVPN({
  apiUrl: env.OUTLINE_API_URL,
  fingerprint: env.OUTLINE_FINGERPRINT,
});

export default client;
