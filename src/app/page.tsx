"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Home() {
  const handleLogin = () => {
    redirect("/dashboard");
  };

  return (
    <div>
      Login homepage?
      <Button onClick={handleLogin} className="text-white">
        Login
      </Button>
    </div>
  );
}
