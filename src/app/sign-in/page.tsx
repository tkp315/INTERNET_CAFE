"use client";
import { useSession, signIn } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { loginData } from "@/utilities/data/user.data";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { loginSchema } from "../schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
type Login = z.infer<typeof loginSchema>;

function Page() {
  const { data: session, status } = useSession();
  console.log(session);

  const form = useForm<Login>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const {
    formState: { errors },
  } = form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<Login> = async (data) => {
    try {
      setIsSubmitting(true);
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        toast({
          title: "Login Error",
          description: res.error,
          variant:"destructive"
        });
      } else {
        // Redirect to dashboard or home after successful login
        router.push("/");
      }
    } catch (error) {
      const errMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data?.message || "An error occurred"
          : "Message Not Found";

      toast({
        title: "Error",
        description: errMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-lg mx-auto mt-8 border border-ring mb-2">
        <CardHeader>
          <CardTitle>Login Form</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-3 flex flex-col gap-4"
            >
              {loginData.map((item, idx) => (
                <FormField
                  key={idx}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        {item.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          {...field}
                          type={item.type}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs">
                        {errors[item.name]?.message?.toString()}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              ))}
              <div className="">
                Forget Password ?
                <Link href="/reset-password">
                  <Button variant="link" className="text-blue-400">
                    Reset Password
                  </Button>
                </Link>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Login "
                )}
              </Button>
            </form>
          </FormProvider>
          <Separator className=" my-4" />
          <div className=" flex flex-row gap-4">
            <button
              className="rounded-full bg-slate-100 p-2"
              onClick={handleGoogleSignIn}
            >
              <FaGoogle className=" rounded-full text-xl text-black" />
            </button>
            <button
              className="rounded-full bg-slate-100 p-2"
              onClick={handleGoogleSignIn}
            >
              <FaFacebook className=" rounded-full text-xl text-blue-700" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
