import { NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/users-db';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Full Name is required.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
    }

    // Create custom user record
    const user = await createUser(name.trim(), email.trim(), password);


    // Return the safe user object (excluding the hash)
    const { passwordHash, ...safeUser } = user;

    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (err) {
    console.error('Signup API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
