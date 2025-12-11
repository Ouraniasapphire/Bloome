// src/routes/home.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../clients/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import SignIn from "~/components/SignInButton/SignIn";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate(`${window.location.origin}/redirect`); // redirect logged-in users to dashboard
      }
    });

    // Listen for auth state changes (optional)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate(`${window.location.origin}/redirect`);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/redirect`, // redirect after OAuth
      },
    });
  };

  if (session) {
    return <div>Redirecting to dashboard...</div>; // optional loading state
  }

  return (
    <div className="h-dvh w-vw flex items-center justify-center bg-(--surface-0)">
      <div className="text-center border-(--surface-100) border-2 p-4 rounded-4xl bg-(--surface-100) shadow">
        <h1 className="mx-4 my-20 text-6xl font-bold">Bloome</h1>
        <SignIn action={signInWithGoogle}/>
      </div>
    </div>
  );
}
