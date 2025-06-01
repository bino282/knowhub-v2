import { authOptions } from "@/lib/authOption";
import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import type { NextAuthOptions, Session } from "next-auth";
// import { verifyPassword } from "@/utils/password";
// import { prisma } from "@/lib/prisma";
// import { registerRagflowUser } from "@/app/actions/register";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//       allowDangerousEmailAccountLinking: true,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         console.log("Credentials:", credentials);

//         const user = await prisma.user.findUnique({
//           where: {
//             email: credentials.email,
//           },
//         });

//         if (!user || !user.password) {
//           return null;
//         }

//         const isPasswordValid = verifyPassword(
//           credentials.password,
//           user.password
//         );

//         console.log("Is password valid:", isPasswordValid);

//         if (!isPasswordValid) {
//           return null;
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//         };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt" as const,
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   debug: process.env.NODE_ENV === "development",
//   pages: {
//     signIn: "/login",
//   },

//   callbacks: {
//     async signIn({ user, account, profile }) {
//       if (account?.provider === "google" && profile) {
//         const existingUser = await prisma.user.findUnique({
//           where: { email: profile.email },
//         });
//         // register user ragflow
//         if (!profile.email || !profile.name || existingUser) {
//           return false;
//         }
//         await registerRagflowUser(profile.email, profile.name);
//       }

//       return true;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }: { session: Session; token: any }) {
//       if (session.user) {
//         session.user.id = token.id;
//       }
//       return session;
//     },
//   },
// };

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
