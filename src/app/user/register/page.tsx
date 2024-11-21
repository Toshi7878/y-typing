import NewNameDialog from "./NewNameDialog";
import { auth } from "@/lib/auth";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NewNameDialog />
    </main>
  );
}
