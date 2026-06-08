import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const DEMO_COOKIE = "pg_demo_linked";

export async function isLinked(): Promise<boolean> {
  const store = await cookies();
  return store.get(DEMO_COOKIE)?.value === "1";
}

/** Use in server components for screens that require a linked demo account. */
export async function requireLinked(): Promise<void> {
  if (!(await isLinked())) redirect("/");
}
