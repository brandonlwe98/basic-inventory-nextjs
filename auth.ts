import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
// import { sql } from '@vercel/postgres';
import { pool } from './db.config';

async function getUser(username: string): Promise<User | undefined> {
  try {
    const user = await pool.query(`SELECT * FROM users WHERE name='${username}'`);
    // const user = await sql<User>`SELECT * FROM users WHERE name=${username}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await getUser(username)
          if (!user) return null;

          const passwordsMatch = password === user.password;
          
          if (passwordsMatch) {
            return user;
          }
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
