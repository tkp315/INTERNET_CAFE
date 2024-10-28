
interface Signup{
    name:string,
    label:string,
    placeholder:string,
    type:string,
}

export const signupData:Array<Signup> = [
    {
        name:"email",
        label:"Email",
        placeholder:"abc@gmail.com",
        type:"email"
    },
    {
        name:"name",
        label:"Full Name",
        placeholder:"John Doe",
        type:"text"
    },
    {
        name:"phoneNo",
        label:"Phone No",
        placeholder:"1111111111",
        type:"text"
    },
    {
        name:"password",
        label:"Password",
        placeholder:"********",
        type:"password"
    },
    {
        name:"confirmPassword",
        label:"Confirm Password",
        placeholder:"********",
        type:"password"
    },
  
    {
        name:"otp",
        label:"OTP",
        placeholder:"******",
        type:"text"
    }
    
]

export const loginData:Array<Signup> = [
    {
        name:"email",
        label:"Email",
        placeholder:"abc@gmail.com",
        type:"email"
    },
    {
        name:"password",
        label:"Password",
        placeholder:"********",
        type:"password"
    }
]