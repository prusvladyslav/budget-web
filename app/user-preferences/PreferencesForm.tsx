"use client";
import { Button } from "@/components/ui/button";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/nyPiAGwrTzL
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { SelectUser } from "@/db/schema";
import { useRouter } from "next/navigation";

export default function Component({
  user,
  action,
}: {
  user: SelectUser;
  action: (userId: string, formData: FormData) => Promise<boolean>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const saveUserPreferencesWithId = action.bind(null, user.id);
  return (
    <form
      action={async (formData) => {
        const success = await saveUserPreferencesWithId(formData);

        if (success) {
          return router.push("/");
        }

        return toast({
          variant: "destructive",
          title: "Something went wrong",
        });
      }}
    >
      <Card className="w-full p-6 min-w-[300px] grid gap-6">
        <div className="space-y-2">
          <CardTitle>Customize Your Experience</CardTitle>
          <CardDescription>
            Select your preferences for cycle start date and end date
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <Select
            defaultValue={user.prefferedStartDate || undefined}
            name="startDate"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Start Date" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 30 }).map((_, index) => {
                const value = (index + 1).toString();
                return (
                  <SelectItem key={index} value={value}>
                    {value}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select
            defaultValue={user.prefferedEndDate || undefined}
            name="endDate"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="End Date" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 30 }).map((_, index) => {
                const value = (index + 1).toString();
                return (
                  <SelectItem key={index} value={value}>
                    {value}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">
          Save
        </Button>
      </Card>
    </form>
  );
}
