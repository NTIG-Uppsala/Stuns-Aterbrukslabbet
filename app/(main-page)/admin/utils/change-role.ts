"use server";

import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";

interface ChangeRoleProps {
  id: string;
  email: string;
  newRole: string;
}

export default async function changeRole({
  id,
  email,
  newRole,
}: ChangeRoleProps) {
  if (!checkRole("admin")) {
    return { error: "Not Authorized" };
  }

  let user;

  try {
    user = await clerkClient.users.updateUser(id, {
      publicMetadata: { role: newRole },
    });
  } catch (err) {
    return { error: "Failed to change role" };
  }
  return { data: email };
}