import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    // async session({ session, token }) {
    //   return session // The return type will match the one returned in 'auth()'
    // },
    // async signIn({ user, account, profile, email, credentials }) {
    //   return user as any;
    // },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;