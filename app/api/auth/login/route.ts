import { NextResponse } from 'next/server';
import { findUserByEmail, hashPassword } from '@/lib/users-db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate inputs
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Verify password hash
    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Return the safe user object (excluding the hash)
    const { passwordHash, ...safeUser } = user;

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (err) {
    console.error('Login API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
