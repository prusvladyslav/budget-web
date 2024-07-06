"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KnVZDiAoRBL
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SelectUser } from "@/db/schema";
import { getMonth } from "date-fns";
import { TAddNewCycle } from "@/app/page";

export const AddNewCycleCard = ({
  action,
  user,
}: {
  user: SelectUser;
  action: (data: TAddNewCycle) => Promise<void>;
}) => {
  const [categories, setCategories] = useState<
    Array<{ id: number; title: string; planned: number }>
  >([]);
  const actionWithUserProps = action.bind(null, {
    userId: user.id,
    startDate: user.prefferedStartDate as string,
    endDate: user.prefferedEndDate as string,
    categories: categories.map((category) => ({
      title: category.title,
      planned: category.planned,
    })),
  });

  return (
    <form
      action={async () => {
        await actionWithUserProps();
      }}
      className="flex flex-col space-y-4"
    >
      <div className="flex flex-col  justify-center space-y-4 min-w-[300px] max-w-xs">
        <h2>New Cycle Creation</h2>
        <h3>
          Start date: {user.prefferedStartDate}.{getMonth(new Date()) + 1}
        </h3>
        <h3>
          End date: {user.prefferedEndDate}.{getMonth(new Date()) + 2}
        </h3>
      </div>

      {categories.map((category, index) => {
        return (
          <Card className="w-full min-w-[300px] max-w-md p-4" key={category.id}>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="category-title"
                    className="flex justify-between"
                  >
                    Category {index + 1} Title{" "}
                    <button
                      type="button"
                      onClick={() =>
                        setCategories(
                          categories.filter((item) => item.id !== category.id)
                        )
                      }
                    >
                      x
                    </button>
                  </Label>
                  <Input
                    onChange={(e) =>
                      setCategories(
                        categories.map((item, index) =>
                          index === category.id
                            ? { ...item, title: e.target.value }
                            : item
                        )
                      )
                    }
                    id="category-title"
                    placeholder="Enter category title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planned-amount">
                    Planned Amount for category {index + 1}
                  </Label>
                  <Input
                    id="planned-amount"
                    type="number"
                    placeholder="0.00"
                    onChange={(e) =>
                      setCategories(
                        categories.map((item, index) =>
                          index === category.id
                            ? { ...item, planned: +e.target.value }
                            : item
                        )
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <Button
        className="bg-gray-500"
        type="button"
        onClick={() =>
          setCategories([
            ...categories,
            { id: categories.length, title: "", planned: 0 },
          ])
        }
      >
        Add new category
      </Button>
      <Button type="submit">Save Cycle</Button>
    </form>
  );
};
