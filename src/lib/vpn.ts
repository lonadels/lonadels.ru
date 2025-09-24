import {OutlineVPN} from 'outlinevpn-api';

const client = new OutlineVPN({
  apiUrl: process.env.OUTLINE_API_URL!,
  fingerprint: process.env.OUTLINE_FINGERPRINT!
});

export default client;
