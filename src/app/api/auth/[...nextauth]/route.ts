import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axiosInstance from '@/lib/axios';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          // register/login user in our backend
          const res = await axiosInstance.post('/auth/google', {
            name: user.name,
            email: user.email,
            googleId: account.providerAccountId,
          });
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };