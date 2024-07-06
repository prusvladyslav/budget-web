import { db } from "@/db";
import PreferencesForm from "./PreferencesForm";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Component() {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, "1"),
  });

  if (!user) return null;

  async function saveUserPreferences(userId: string, formData: FormData) {
    "use server";
    const rawFormData = {
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
    };
    const { startDate, endDate } = rawFormData;

    if (!startDate || !endDate) {
      return false;
    }

    try {
      await db
        .update(usersTable)
        .set({ prefferedStartDate: startDate, prefferedEndDate: endDate })
        .where(eq(usersTable.id, userId));

      revalidatePath("/user-preferences");
      revalidatePath("/");
      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  return <PreferencesForm action={saveUserPreferences} user={user} />;
}

export const dynamic = "force-dynamic";
