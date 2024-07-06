"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { format } from "date-fns";
import { SelectUser } from "@/db/schema";
import Link from "next/link";
import { TAddNewCycle } from "@/app/page";
import { AddNewCycleCard } from "./AddNewCycleCard";

type Props = {
  array: Array<{ dateFrom?: string; dateTo?: string; id?: string }>;
  action: (data: TAddNewCycle) => Promise<void>;
  user: SelectUser;
  noCycleForCurrentMonth: boolean;
};

export const CyclesCarousel: React.FC<Props> = ({
  array,
  action,
  user,
  noCycleForCurrentMonth,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-center">Cycles</h2>
      <Carousel
        className="w-full max-w-xs min-w-[300px]"
        opts={{ startIndex: array.length - 1 }}
      >
        <CarouselContent>
          {array.map((item, index, array) => (
            <CarouselItem key={index}>
              <div className={"flex flex-col space-y-4 p-1 justify-center"}>
                {index === array.length - 1 && noCycleForCurrentMonth ? (
                  <AddNewCycleCard action={action} user={user} />
                ) : (
                  <Link href={`/${item.dateFrom}`}>
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
