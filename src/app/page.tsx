import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth-server';
import CinematicExperience from '@/components/landing/CinematicExperience';

export const metadata = {
  title: 'Synaps AI — Enterprise Intelligence Operating System (3D Story Mode)',
  description: 'Interactive 3D Scrollytelling Story Mode for Synaps AI Enterprise OS.',
};

export default async function RootPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;

  if (session && !session.startsWith('TEST_TOKEN_')) {
    const decoded = await verifySessionCookie(session);
    if (decoded?.uid) {
      redirect('/dashboard');
    }
  }

  // Render 3D Story Mode Landing Page with Embedded Video
  return <CinematicExperience />;
}
