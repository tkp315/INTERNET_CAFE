import  { dbConnectionInstance } from "@/lib/db";
import { UserModel } from '@/models/User.model';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import GoogleProvider from 'next-auth/providers/google';
import { CLIENT } from "@/lib/constants";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        const email = credentials.email;  // Fixed here
        const password = credentials.password;
        await dbConnectionInstance.connectToDB();
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            throw new Error("User is not registered");
          }
          const isCorrectPassword = await bcrypt.compare(password, user.password);
          if (!isCorrectPassword) {
            throw new Error("Incorrect Password");
          }
          return user;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          response_type: 'code',
          access_type: "offline",
        }
      }
    })
  ],
  callbacks: {
    async signIn({ account, profile,user }) {
        await dbConnectionInstance.connectToDB()
  
        // Only applicable for Google logins
        if (account?.provider === "google") {
          const existingUser = await UserModel.findOne({ email: profile?.email });
  
          if (!existingUser) {
            // Redirect to the verification page
            await UserModel.create({
            name:profile?.name,
            email:profile?.email,
            isVerified:true,
            role:CLIENT,
           })
          }
        }
  
        return true; // Continue with the sign-in process
      },
    async session({ session, token,user }) {
      session.accessToken = token?.accessToken!;
      session.role = token?.role!;
      session._id = token?._id!;
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = account?.access_token;
        token.role = user.role;
        token._id = user._id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out'
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
