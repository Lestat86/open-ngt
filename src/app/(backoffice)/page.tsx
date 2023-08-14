import { Database } from "@/types/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>Hello, {session.user.email}</h1>
        <h1>{session.user.user_metadata.name}</h1>
        <h1>{session.user.user_metadata.surname}</h1>
        <h1>{session.user.user_metadata.isAdmin ? 'POWAH' : 'NOPOWAH'}</h1>
      </div>
    </main>
  );
}