import { BackButton } from "@/components/common/BackButton";
import { AddNewWeek } from "@/components/weeks/AddNewWeek";
import { WeeksCarousel } from "@/components/weeks/WeeksCarousel";
import { db } from "@/db";
import { cyclesTable, expensesTable, weeksTable } from "@/db/schema";
import { endOfWeek, getMonth, startOfWeek } from "date-fns";
import { eq } from "drizzle-orm";
import { last } from "lodash";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export type TAddNewWeek = {
  monthId: string;
};

async function addNewWeek({ monthId }: TAddNewWeek) {
  "use server";
  const date = new Date();
  try {
    await db.insert(weeksTable).values({
      monthId,
      dateFrom: new Date(
        date.getFullYear(),
        getMonth(date),
        startOfWeek(date, { weekStartsOn: 1 }).getDate(),
        0,
        0,
        0,
        0
      ).toISOString(),
      dateTo: new Date(
        date.getFullYear(),
        getMonth(date),
        endOfWeek(date, { weekStartsOn: 1 }).getDate(),
        0,
        0,
        0,
        0
      ).toISOString(),
    });
  } catch (error) {
    console.error("Error adding new week:", error);
  }
  revalidatePath("/");
}

export default async function Cycle({ params }: { params: { cycle: string } }) {
  const cycle = await db.query.cyclesTable.findFirst({
    where: eq(cyclesTable.dateFrom, decodeURIComponent(params.cycle)),
  });

  if (!cycle) return null;
  // const expenses = await db.query.expensesTable.findMany({
  //   where: eq(expensesTable.cycleId, cycle.id),
  // });
  const weeks = await db.query.weeksTable.findMany({
    where: eq(weeksTable.monthId, cycle.id),
  });

  const currentWeekStartedAt = startOfWeek(new Date(), { weekStartsOn: 1 });

  const lastWeek = last(weeks);

  const noWeekForCurrentDate =
    !lastWeek || lastWeek.dateFrom !== currentWeekStartedAt.toISOString();

  return (
    <>
      <BackButton href="/" title="Back to month page" />
      <div className="flex justify-center items-center p-24 min-h-screen">
        {!weeks.length ? (
          <AddNewWeek action={addNewWeek} monthId={cycle.id} />
        ) : (
          <WeeksCarousel
            array={noWeekForCurrentDate ? [...weeks, {}] : weeks}
            action={addNewWeek}
            cycleFrom={cycle.dateFrom}
            noCycleForCurrentMonth={noWeekForCurrentDate}
            monthId={cycle.id}
          />
        )}
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "Weeks page",
  description: "Weeks page",
};

export const dynamic = "force-dynamic";
