"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft } from "react-icons/fa";
import { Store } from "lucide-react";
import Logo from "@/components/Logo";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

const signUpSchema = signInSchema.extend({
  name: z.string().min(3),
});

const authSchema = (ignoreName: boolean) =>
  z.object({
    email: z.string().email(),
    password: z.string().min(3),
    ...(ignoreName ? {} : { name: z.string().min(3) }),
  });

const AuthSignUpSchema = authSchema(false);
const AuthSignInSchema = authSchema(true);
type AuthSignupForm = z.infer<typeof AuthSignUpSchema>;
type AuthSignInForm = z.infer<typeof AuthSignInSchema>;
type AuthVarient = "login" | "register";

export default function SignUp() {
  const router = useRouter();

  const [authVariant, setAuthVariant] = useState<AuthVarient>("login");

  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const login = useCallback<SubmitHandler<AuthSignInForm>>(
    async ({ email, password }) => {
      console.log("logging in");
      if (!email!.length || !password!.length) {
        console.log("Email or password is empty");
        return;
      }

      try {
        await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        router.push("/dashboard");
      } catch (error) {
        console.log(error);
      }
    },
    [router]
  );

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return null;
  }

  return (
    <>
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <div className="h-10 w-auto ">
                <Logo className="text-white text-4xl font-semibold" />
              </div>

              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-white dark:text-gray-100">
                Login
              </h2>
            </div>

            <div className="mt-10">
              <div>
                <form onSubmit={handleSubmit(login)} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-white dark:text-gray-100"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        {...register("email")}
                        type="email"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-white dark:text-gray-100"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        {...register("password")}
                        type="password"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
                <p className="mt-10 text-center text-sm text-gray-500">
                  Not a member?{" "}
                  <Link
                    href="/sign-up"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  >
                    Sign Up Today
                  </Link>
                </p>
              </div>

              <div className="mt-10">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-[#111827] px-6 text-white dark:text-gray-100">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={() =>
                      signIn("google", { callbackUrl: "/dashboard" })
                    }
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-1.5 text-black drop-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
                  >
                    <FcGoogle size={24} />
                    <span className="text-sm font-semibold leading-6">
                      Google
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      signIn("github", { callbackUrl: "/dashboard" })
                    }
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-1.5 text-black drop-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
                  >
                    <FaGithub size={24} />
                    <span className="text-sm font-semibold leading-6">
                      GitHub
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <div className="absolute inset-0 h-full w-full">
            <Image
              src="/robo.webp"
              alt=""
              className="object-cover"
              fill
            />
          </div>
        </div>
      </div>
    </>
  );
}
