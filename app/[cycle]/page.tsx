import { BackButton } from "@/components/common/BackButton";
import { AddNewWeek } from "@/components/weeks/AddNewWeek";
import { WeeksCarousel } from "@/components/weeks/WeeksCarousel";
import { db } from "@/db";
import { cyclesTable, weeksTable } from "@/db/schema";
import { endOfWeek, getMonth, isEqual, startOfWeek } from "date-fns";
import { eq } from "drizzle-orm";
import { last } from "lodash";
import { Metadata } from "next";
import { revalidatePath, unstable_noStore } from "next/cache";
import { toZonedTime } from "date-fns-tz";

export type TAddNewWeek = {
  monthId: string;
};

async function addNewWeek({ monthId }: TAddNewWeek) {
  "use server";
  const date = toZonedTime(new Date(), "Europe/Kiev");
  try {
    await db.insert(weeksTable).values({
      monthId,
      dateFrom: new Date(
        date.getFullYear(),
        getMonth(date),
        startOfWeek(toZonedTime(new Date(), "Europe/Kiev"), {
          weekStartsOn: 1,
        }).getDate(),
        0,
        0,
        0,
        0
      ).toISOString(),
      dateTo: new Date(
        date.getFullYear(),
        getMonth(date),
        endOfWeek(toZonedTime(new Date(), "Europe/Kiev"), {
          weekStartsOn: 1,
        }).getDate(),
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
  unstable_noStore();
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

  const currentWeekStartedAt = startOfWeek(
    toZonedTime(new Date(), "Europe/Kiev"),
    {
      weekStartsOn: 1,
    }
  );

  const lastWeek = last(weeks);

  const noWeekForCurrentDate =
    !lastWeek ||
    !isEqual(
      toZonedTime(lastWeek.dateFrom, "Europe/Kiev"),
      currentWeekStartedAt
    );

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
