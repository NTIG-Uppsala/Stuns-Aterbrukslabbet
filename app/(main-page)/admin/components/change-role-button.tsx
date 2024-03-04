"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { changeRole } from "@/actions/change-role";
import { useAction } from "@/hooks/use-action";

interface ChangeRoleButtonProps {
  id: string;
  email: string;
  role: string;
}

export default function ChangeRoleButton({
  id,
  email,
  role,
}: ChangeRoleButtonProps) {
  const router = useRouter();

  const { execute } = useAction(changeRole, {
    onSuccess(data) {
      router.refresh();
      toast.success("Roll ändrad för " + data);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onChangeRole = () => {
    execute({ id, email, role });
  };

  if (role === "member") {
    return (
      <AlertDialog>
        <AlertDialogTrigger className="font-medium hover:line-through hover:opacity-80">
          Moderator
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Är du säker?</AlertDialogTitle>
            <AlertDialogDescription>
              Detta kommer ta bort moderator rollen från
              <span className="font-semibold text-black"> {email}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction variant="destructive">
              <button onClick={onChangeRole}>Ta bort moderator</button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else {
    return (
      <AlertDialog>
        <AlertDialogTrigger className="font-medium hover:opacity-80">
          Gör moderator
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Är du säker?</AlertDialogTitle>
            <AlertDialogDescription>
              Detta kommer att göra{" "}
              <span className="font-semibold text-black">{email}</span> till
              moderator. Moderatorer har tillgång till fler funktioner så som
              att ta bort inlägg och användare.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction>
              <button onClick={onChangeRole}>Gör moderator</button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
}
