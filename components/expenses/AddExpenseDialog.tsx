import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db";
import { expensesTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
type Props = {
  categoryName: string;
  categoryId: string;
  weekId: string;
  userId: string;
  previousPath: string;
  cycleId: string;
};
export const AddExpenseDialog: React.FC<Props> = ({
  categoryName,
  categoryId,
  weekId,
  cycleId,
  userId,
  previousPath,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add new expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="font-semibold">
          Add new expense for category{" "}
          <span className="font-bold underline">
            {decodeURIComponent(categoryName)}
          </span>
        </DialogTitle>
        <form
          className="grid gap-4 py-4"
          action={async (formData) => {
            "use server";

            const amount = formData.get("amount") as string;
            const comment =
              typeof formData.get("comment") === "string"
                ? (formData.get("comment") as string)
                : null;

            try {
              await db.insert(expensesTable).values({
                amount: +amount,
                categoryId,
                comment,
                weekId,
                userId,
                // cycleId,
              });
              revalidatePath(previousPath + categoryName);
              revalidatePath(previousPath);
            } catch (error) {}
          }}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              required
              defaultValue={0}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comment" className="text-right">
              Comment (optional)
            </Label>
            <Input id="comment" name="comment" className="col-span-3" />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Save new expense</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
