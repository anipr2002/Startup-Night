import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  // Redirect to sign in if user is not signed in
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <div>{children}</div>;
};

export default Layout;
