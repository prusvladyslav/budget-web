import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { BackButton } from "@/components/common/BackButton";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";

export const metadata: Metadata = {
  title: "User Preferences",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, "1"),
  });
  return (
    <div className="relative">
      {user?.prefferedEndDate && user.prefferedStartDate && (
        <div className="absolute top-0 left-0">
          <BackButton href="/" title="Back to home page" />
        </div>
      )}
      <div className="flex justify-center items-center p-24 min-h-screen">
        {children}
      </div>
    </div>
  );
}
