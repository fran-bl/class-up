"use client";

import { createClient } from "@/utils/supabase/client";
import { jwtDecode } from 'jwt-decode';
import { redirect } from "next/navigation";
import { useEffect } from "react";

type DecodedJWT = {
  user_role: string;
}

export default function Home() {
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        redirect('/login');
      }

      const jwt = jwtDecode<DecodedJWT>(session.access_token);
      const userRole = jwt.user_role;

      if (!userRole) {
        redirect('/unauthorized');
      }

      let redirectTo = "/dashboard"
      if (userRole === "admin") {
        redirectTo = "/admin/dashboard"
      } else if (userRole === "teacher") {
        redirectTo = "/teacher/dashboard"
      }

      redirect(redirectTo);
    };

    checkAuth();
  }, []);
}
