"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/dashboard");
  };

  const handleTeacherLogin = () => {
    router.push("/teacher/dashboard");
  }

  return (
    <div>
      Landing
      <Button onClick={handleLogin}>
        Login
      </Button>
      <Button onClick={handleTeacherLogin} variant="secondary">
        Teacher Login
      </Button>
    </div>
  );
}
