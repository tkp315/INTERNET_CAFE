
import { authOptions } from "./option";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions); // name should be handler only

export {handler as GET, handler as POST} 