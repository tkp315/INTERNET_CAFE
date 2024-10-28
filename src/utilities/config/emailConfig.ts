
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:"gmail",
    host:process.env.MAIL_HOST,
    secure:true,
    port:465,
    auth:
    {
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS,
    },
    tls:
    {
        rejectUnauthorized:true
    }
})

const mailSender= async(body:string,to:string,title:string)=>{
   try {
     const info = await  transporter.sendMail({
         from: "Internet Cafe | PK",
         to,
         html:body,
         subject:title
     })
     return info
   } catch (error) {
    console.log("ERR: error sending email",error);
   }
}

export {mailSender}