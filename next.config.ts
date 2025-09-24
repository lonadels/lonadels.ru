import type {NextConfig} from 'next';
import withSerwistInit from '@serwist/next';

import {version} from './package.json';

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
});


const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    version,
  },
};

export default withSerwist(nextConfig);
