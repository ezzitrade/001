import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE = "ezzi_pid";

export function getOrCreatePlayerId() {
  const jar = cookies();
  let pid = jar.get(COOKIE)?.value;
  if (!pid) {
    pid = `p_${randomUUID()}`;
    jar.set(COOKIE, pid, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });
  }
  return pid;
}
