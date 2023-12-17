"use server"

import { signOut } from "../../auth"

export const SignOutAction = async () => {
  await signOut({ redirectTo: "/auth/signin" })
}
