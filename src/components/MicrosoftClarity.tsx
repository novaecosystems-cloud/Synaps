'use client';

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

export default function MicrosoftClarity() {
  useEffect(() => {
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || 'xuccocifvr';
    if (typeof window !== 'undefined' && clarityId) {
      try {
        if (clarity && typeof clarity.init === 'function') {
          clarity.init(clarityId);
        } else if ((clarity as any)?.default && typeof (clarity as any).default.init === 'function') {
          (clarity as any).default.init(clarityId);
        }
      } catch (err) {
        console.warn('Microsoft Clarity init warning:', err);
      }
    }
  }, []);

  return null;
}
