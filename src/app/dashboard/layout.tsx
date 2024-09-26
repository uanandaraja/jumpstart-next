import { validateRequest } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
