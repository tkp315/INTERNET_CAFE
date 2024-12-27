// import { ADMIN } from "@/lib/constants";
// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req:NextRequest){
// const token = await getToken({req,secret:process.env.NEXT_AUTH_SECRET});
// if(!token){
//     return NextResponse.json({
//         message:"Logged in",
//         statusCode:404
//     })
// }

// if(token.role!==ADMIN){
//      return NextResponse.json({
//         message:"You are not admin ",
//         statusCode:404
//     })
// }


// }