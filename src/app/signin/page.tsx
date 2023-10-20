import SignIn from "@/components/client/SignIn";
import { authOptions } from "@/lib/authOptions";
import { LogIn } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signin in to Homework.",
  description: "Create an account or continue with existing one - Homework.",
};
const page = async ({
  searchParams,
}: {
  searchParams: {
    error: string;
  };
}) => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  const { error } = searchParams;
  let message;
  if (error) {
    if (error == "OAuthAccountNotLinked") {
      message = "User already exist with different login method.";
    } else if (error == "Callback") {
      message = "Try with different account.";
    } else {
      message = "Try again, or continue with different account.";
    }
  }
  return (
    <section className="container relative mt-24 md:px-28 flex item-center justify-center">
      <div className="border border-gray-200 max-w-md w-full rounded-lg pb-3 shadow-md">
        <p className="flex gap-x-2 items-center px-4 py-2">
          <LogIn size={18} />
          Sign In to Homework
        </p>
        <hr />
        <div className="p-6">
          <h2 className="text-center text-lg font-semibold">
            Choose a method.
          </h2>
          <p className="text-center text-sm">
            Choose a method to create or log in to your account.
          </p>
        </div>
        <SignIn />

        {message && (
          <p className="text-center mt-3 text-sm text-red-600">{message}</p>
        )}
        <p className="text-center mt-6 text-sm">
          By continuing you agree to our our privacy policy.
        </p>
      </div>
    </section>
  );
};

export default page;
