/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cDf8lyLcht7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { db } from "@/db";
import { expensesTable } from "@/db/schema";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import React from "react";
import { DeleteExpense } from "./DeleteExpense";

type Props = {
  previousPath: string;
  currentPath: string;
  headers: Array<string>;
  rows: Array<{
    id: string;
    amount: number;
    createdAt: string;
    comment: string | null;
  }>;
};

export const ExpensesTable: React.FC<Props> = ({
  headers,
  rows,
  previousPath,
  currentPath,
}) => {
  const deleteExpense = async (id: string) => {
    "use server";
    try {
      await db.delete(expensesTable).where(eq(expensesTable.id, id));
      revalidatePath(previousPath);
      revalidatePath(currentPath);
    } catch (error) {}
  };
  return (
    <div className="bg-background rounded-lg border p-6">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className="text-muted-foreground">
                {header}
              </TableHead>
            ))}
            <TableHead className="text-muted-foreground"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{format(row.createdAt, "dd.MM HH:mm")}</TableCell>
              <TableCell className="truncate max-w-[70px]">
                {row?.comment}
              </TableCell>
              <TableCell>
                <DeleteExpense id={row.id} onClick={deleteExpense} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
