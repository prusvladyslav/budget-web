import { CategoriesTable } from "@/components/categories/CategoriesTable";
import { BackButton } from "@/components/common/BackButton";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import {
  categoriesTable,
  cyclesTable,
  expensesTable,
  weeksTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { unstable_noStore } from "next/cache";

export default async function Week({
  params,
}: {
  params: { cycle: string; week: string };
}) {
  unstable_noStore();
  const week = await db.query.weeksTable.findFirst({
    where: eq(weeksTable.dateFrom, decodeURIComponent(params.week)),
  });

  if (!week) return null;

  const cycle = await db.query.cyclesTable.findFirst({
    where: eq(cyclesTable.dateFrom, decodeURIComponent(params.cycle)),
  });

  if (!cycle) return null;

  const cycleId = cycle.id;

  const expenses = await db.query.expensesTable.findMany({
    where: eq(expensesTable.weekId, week.id),
  });

  const categories = await db.query.categoriesTable.findMany({
    where: eq(categoriesTable.cycleId, cycleId),
  });

  const categoriesWithCurrentAmount = categories.map((category) => ({
    ...category,
    current:
      category.planned -
      expenses
        .filter((expense) => expense.categoryId === category.id)
        .reduce((acc, expense) => acc + expense.amount, 0),
  }));
  return (
    <>
      <BackButton href={`/${params.cycle}`} title="Back to weeks page" />
      <Card className="my-4 max-w-fit ">
        <CardContent className="space-y-4 p-6 ">
          <h2 className="text-xl">
            Total planned amount for this week:{" "}
            <span className="font-bold">
              {categories.reduce((acc, category) => acc + category.planned, 0)}
            </span>
          </h2>
          <h2 className="text-xl">
            Amount left for this week:{" "}
            <span className="font-bold">
              {" "}
              {categoriesWithCurrentAmount.reduce(
                (acc, category) => acc + category.current,
                0
              )}
            </span>
          </h2>
        </CardContent>
      </Card>
      <CategoriesTable
        currentPath={`/${params.cycle}/${params.week}`}
        headers={["Title", "Planned", "Current"]}
        rows={categoriesWithCurrentAmount}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: "Categories page",
  description: "Categories page",
};

export const dynamic = "force-dynamic";
