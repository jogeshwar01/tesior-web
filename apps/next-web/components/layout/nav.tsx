import Navbar from "./navbar";
import { getSession } from "@/lib/auth/session";

export default async function Nav() {
  const session = await getSession();
  return <Navbar session={session} />;
}
