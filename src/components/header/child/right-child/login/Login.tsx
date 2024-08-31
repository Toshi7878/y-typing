import { SignOutButton } from "./SignOutButton";
import { CheckName } from "./CheckName";
import { useSession } from "next-auth/react";
import SignInMenu from "./SignInMenu";
import UserMenu from "./UserMenu";

export default function Login() {
  const { data: session } = useSession();

  if (!session?.user) {
    return <SignInMenu />;
  } else {
    return (
      <>
        {session?.user.name === null ? <SignOutButton /> : <UserMenu />}

        <CheckName name={session.user.name ?? ""} />
      </>
    );
  }
}
