'use client';

import { useEffect } from 'react';
import { buildNumber } from '../config';

export function VersionAlert() {
  useEffect(() => {
    if (buildNumber) {
      // eslint-disable-next-line no-console
      console.info('Version:', buildNumber);
    }
  }, []);

  return null;
}
