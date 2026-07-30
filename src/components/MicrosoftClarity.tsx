'use client';

import { useEffect } from 'react';
import { clarity } from '@microsoft/clarity';

export default function MicrosoftClarity() {
  useEffect(() => {
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || 'xuccocifvr';
    if (typeof window !== 'undefined' && clarityId) {
      clarity.init(clarityId);
    }
  }, []);

  return null;
}
