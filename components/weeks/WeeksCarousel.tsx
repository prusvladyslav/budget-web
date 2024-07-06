"use client";
import * as React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { format } from "date-fns";
import { SelectUser } from "@/db/schema";
import { Button } from "../ui/button";
import Link from "next/link";
import { TAddNewWeek } from "@/app/[cycle]/page";

type Props = {
  array: Array<{ dateFrom?: string; dateTo?: string; id?: string }>;
  action: (data: TAddNewWeek) => Promise<void>;
  noCycleForCurrentMonth: boolean;
  monthId: string;
  cycleFrom: string;
};

export const WeeksCarousel: React.FC<Props> = ({
  array,
  action,
  noCycleForCurrentMonth,
  monthId,
  cycleFrom,
}) => {
  const addNewWeeksWithProps = action.bind(null, { monthId });
  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-center">Weeks</h2>
      <Carousel
        className="w-full max-w-xs min-w-[300px]"
        opts={{ startIndex: array.length - 1 }}
      >
        <CarouselContent>
          {array.map((item, index, array) => (
            <CarouselItem key={index}>
              <div className={"flex flex-col space-y-4 p-1 justify-center"}>
                {index === array.length - 1 && noCycleForCurrentMonth ? (
                  <Card>
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                      <CardHeader>No weeks for current cycle</CardHeader>
                      <form
                        action={async () => {
                          await addNewWeeksWithProps();
                        }}
                      >
                        <Button>Add new week</Button>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Link href={`/${cycleFrom}/${item.dateFrom}`}>
                    <Card>
                      <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                        <span className="text-lg">
                          {index + 1}/{array.length}
                        </span>
                        <span className="text-2xl font-semibold">
                          {item.dateFrom && format(item.dateFrom, "dd.MM")}-
                          {item.dateTo && format(item.dateTo, "dd.MM")}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
