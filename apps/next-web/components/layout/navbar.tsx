import { getSession } from "@/lib/auth/session";
import { Nav } from "./nav";
import { NavMobile } from "./nav-mobile";

export default async function Navbar() {
  const session = await getSession();

  return (
    <>
      <NavMobile session={session} />
      <Nav session={session} />
    </>
  );
}
