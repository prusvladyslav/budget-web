"use client";
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
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  currentPath: string;
  headers: Array<string>;
  rows: Array<{
    id: string;
    title: string;
    planned: number | string;
    current: string | number;
  }>;
};

export const CategoriesTable: React.FC<Props> = ({
  headers,
  rows,
  currentPath,
}) => {
  const router = useRouter();
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => router.push(currentPath + `/${row.title}`)}
            >
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.planned}</TableCell>
              <TableCell>{row.current}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
