// routes/redirect.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../clients/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { getDynamicKey } from "~/utils/getDynamicKey";

export default function Redirect() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const authUserID = session?.user.id // Get ID from supabase user session
      if (!authUserID) {
        return
      }

      const urlParam = await getDynamicKey({userID: authUserID}) // Feed ID to get dynamic key

      if (session) {
        navigate(`/${urlParam}/dashboard`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }

      setLoading(false);
    }

    checkSession();
  }, [navigate]);

  // Optional: show a loading message while redirecting
  return loading ? <div id="loader">Redirecting...</div> : null;
}
