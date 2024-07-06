import { BackButton } from "@/components/common/BackButton";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { ExpensesTable } from "@/components/expenses/ExpensesTable";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import {
  categoriesTable,
  cyclesTable,
  expensesTable,
  weeksTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import { unstable_noStore } from "next/cache";

export default async function Category({
  params,
}: {
  params: { cycle: string; week: string; category: string };
}) {
  unstable_noStore();
  const cycle = await db.query.cyclesTable.findFirst({
    where: eq(cyclesTable.dateFrom, decodeURIComponent(params.cycle)),
  });

  if (!cycle) return null;

  const week = await db.query.weeksTable.findFirst({
    where: eq(weeksTable.dateFrom, decodeURIComponent(params.week)),
  });

  if (!week) return null;

  const category = await db.query.categoriesTable.findFirst({
    where: eq(categoriesTable.title, decodeURIComponent(params.category)),
  });

  if (!category) return null;

  const expenses = await db.query.expensesTable.findMany({
    where: and(
      eq(expensesTable.weekId, week.id),
      eq(expensesTable.categoryId, category.id)
    ),
  });

  return (
    <div className="space-y-4">
      <BackButton
        href={`/${params.cycle}/${params.week}`}
        title="Back to categories page"
      />
      <Card className="max-w-fit">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl">
            Category:{" "}
            <span className="font-bold">
              {decodeURIComponent(params.category)}
            </span>
          </h2>
          <h2 className="text-xl">
            Planned amount:{" "}
            <span className="font-bold">{category.planned}</span>
          </h2>
          <h2 className="text-xl">
            Current amount:{" "}
            <span className="font-bold">
              {" "}
              {category.planned -
                expenses.reduce((acc, cur) => acc + cur.amount, 0)}
            </span>
          </h2>
        </CardContent>
      </Card>

      <AddExpenseDialog
        cycleId={cycle.id}
        categoryName={params.category}
        categoryId={category.id}
        weekId={week.id}
        userId={"1"}
        previousPath={`/${params.cycle}/${params.week}`}
      />

      <ExpensesTable
        headers={["Amount", "Date", "Comment"]}
        rows={expenses}
        previousPath={`/${params.cycle}/${params.week}`}
        currentPath={`/${params.cycle}/${params.week}/${params.category}`}
      />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Category page",
  description: "Category page",
};

export const dynamic = "force-dynamic";
