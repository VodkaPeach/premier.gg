"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE } from "@/lib/auth";

export async function linkDemoAccount(): Promise<void> {
  (await cookies()).set(DEMO_COOKIE, "1", { path: "/", maxAge: 60 * 60 * 24 * 7 });
  redirect("/connect/success");
}

export async function unlinkDemoAccount(): Promise<void> {
  (await cookies()).delete(DEMO_COOKIE);
  redirect("/");
}
