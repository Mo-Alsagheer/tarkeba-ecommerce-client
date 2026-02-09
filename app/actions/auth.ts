'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'tarkeba_access_token';

export async function createSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    // Set a reasonable expiration, e.g., 7 days or match your JWT expiry
    maxAge: 7 * 24 * 60 * 60, 
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
