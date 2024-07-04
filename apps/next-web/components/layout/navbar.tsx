import { getSession } from "@/lib/auth/session";
import { Nav } from "./nav";

export default async function Navbar() {
  const session = await getSession();

  return (
    <>
      <Nav session={session} />
    </>
  );
}
