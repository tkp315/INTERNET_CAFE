import 'next-auth'
import { DefaultSession } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth'{
    interface User {
      name?: string,
      email?:string,
      _id?:string,
      accessToken?:string,
      role:string
    }
    interface Session extends DefaultSession {
        accessToken:string,
        role:string,
        _id:string
    }
}


declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT{
   accessToken?:string,
   role?:string
   _id?:string
   
  }
}