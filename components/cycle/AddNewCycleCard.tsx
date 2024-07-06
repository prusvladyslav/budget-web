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
import { TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const IsSubmitDisabled =
    categories.length === 0 ||
    categories.some((category) => !category.planned || !category.title);

  return (
    <form
      action={async () => {
        await actionWithUserProps();
      }}
      className="flex flex-col space-y-4"
    >
      <Card>
        <CardContent className="flex flex-col  justify-center space-y-4 min-w-[300px] max-w-xs p-6">
          <h2 className="text-xl font-bold">New Cycle Creation</h2>
          <h3 className="text-xl font-semibold">
            Start date:{" "}
            <span className="font-bold underline">
              {user.prefferedStartDate}.{getMonth(new Date()) + 1}
            </span>
          </h3>
          <h3 className="text-xl font-semibold">
            End date:{" "}
            <span className="font-bold underline">
              {user.prefferedEndDate}.{getMonth(new Date()) + 2}
            </span>
          </h3>
        </CardContent>
      </Card>

      {categories.map((category, index) => {
        return (
          <Card className="w-full min-w-[300px] max-w-md p-6" key={category.id}>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="category-title"
                    className="flex justify-between font-bold"
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
                      <TrashIcon className="h-5 w-5" />
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
                  <Label htmlFor="planned-amount" className="font-bold">
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
        className="bg-green-500"
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
      <Button
        type="submit"
        disabled={IsSubmitDisabled}
        className={cn(IsSubmitDisabled && "bg-gray-500")}
      >
        Save Cycle
      </Button>
    </form>
  );
};
