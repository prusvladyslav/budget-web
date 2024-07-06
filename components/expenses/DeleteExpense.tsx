"use client";
import React from "react";
import { TrashIcon } from "lucide-react";

type Props = {
  id: string;
  onClick: (id: string) => void;
};

export const DeleteExpense: React.FC<Props> = ({ id, onClick }) => {
  return (
    <button onClick={() => onClick(id)}>
      <TrashIcon className="h-5 w-5" />
    </button>
  );
};
