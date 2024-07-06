import { CyclesCarousel } from "@/components/cycle/CyclesCarousel";
import { db } from "@/db";
import {
  categoriesTable,
  cyclesTable,
  InsertCategory,
  usersTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { getMonth } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { last } from "lodash";
import { AddNewCycleCard } from "@/components/cycle/AddNewCycleCard";
import { Metadata } from "next";
import { BackButton } from "@/components/common/BackButton";

export type TAddNewCycle = {
  userId: string;
  startDate: string;
  endDate: string;
  categories: Omit<InsertCategory, "cycleId">[];
};

async function addNewCycle({
  userId,
  startDate,
  endDate,
  categories,
}: TAddNewCycle) {
  "use server";
  const date = new Date();
  const month = getMonth(date);

  try {
    const newCycle = await db
      .insert(cyclesTable)
      .values({
        userId,
        dateFrom: new Date(
          date.getFullYear(),
          month,
          +startDate,
          0,
          0,
          0,
          0
        ).toISOString(),
        dateTo: new Date(
          date.getFullYear(),
          month + 1,
          +endDate,
          0,
          0,
          0,
          0
        ).toISOString(),
      })
      .returning({ id: cyclesTable.id });
    const categoriesWithCycleId = categories.map((category) => ({
      ...category,
      cycleId: newCycle[0].id,
    }));
    await db.insert(categoriesTable).values(categoriesWithCycleId);
  } catch (error) {
    console.error("Error adding new cycle:", error);
  }
  revalidatePath("/");
}

export default async function Home() {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, "1"),
  });

  if (!user) return null;

  if (!user.prefferedEndDate || !user.prefferedStartDate)
    return redirect("/user-preferences");

  // redirect to current month and week

  const cycles = await db.query.cyclesTable.findMany({
    where: eq(cyclesTable.userId, user.id),
  });

  const currentMonth = getMonth(new Date());

  const lastCycle = last(cycles);

  const noCycleForCurrentMonth =
    !lastCycle || getMonth(new Date(lastCycle.dateFrom)) !== currentMonth;

  return (
    <>
      <BackButton href="/user-preferences" title="User Preferences" />
      <div className="flex justify-center items-center p-24 min-h-screen">
        {!cycles.length ? (
          <AddNewCycleCard action={addNewCycle} user={user} />
        ) : (
          <CyclesCarousel
            array={noCycleForCurrentMonth ? [...cycles, {}] : cycles}
            action={addNewCycle}
            user={user}
            noCycleForCurrentMonth={noCycleForCurrentMonth}
          />
        )}
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "Month page",
  description: "Month page",
};
