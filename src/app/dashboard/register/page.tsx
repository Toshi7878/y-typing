import { SessionProvider } from "next-auth/react";
import NewNameDialog from "./NewNameDialog";
export const runtime = "edge";

export default function Home() {
  return (
    <SessionProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <NewNameDialog />
      </main>
    </SessionProvider>
  );
}
