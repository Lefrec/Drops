import { cookies } from "next/headers";
import Link from "next/link";
import { LogoutButton } from "./logout_button";

export async function Header() {
  const isLoggedIn = Boolean((await cookies()).get("session")?.value);

  return (
    <header className="site-header">
      <Link className="site-header-brand" href="/drops">
        Drops
      </Link>
      <Link href="/status">Status</Link>
      <nav className="site-header-nav" aria-label="Navigation principale">
        <Link href="/auth/login">Connexion</Link>
        <Link href="/auth/register">Créer un compte</Link>
        {isLoggedIn && (
          <LogoutButton />
        )}
      </nav>
    </header>
  );
}
