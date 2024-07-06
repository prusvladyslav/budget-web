"use client";
import React from "react";
import { Button } from "../ui/button";
import { TAddNewWeek } from "@/app/[cycle]/page";
type Props = {
  action: (data: TAddNewWeek) => Promise<void>;
  monthId: string;
};
export const AddNewWeek: React.FC<Props> = ({ action, monthId }) => {
  const addNewWeek = action.bind(null, {
    monthId,
  });

  return (
    <form
      action={async () => {
        await addNewWeek();
      }}
    >
      <Button>Add new week</Button>
    </form>
  );
};
