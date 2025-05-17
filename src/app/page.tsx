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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to <span style={{ fontFamily: 'var(--font-gta-medium)' }}>ClassUp</span>!</h1>
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={handleLogin} className="text-xl cursor-pointer">
          Login
        </Button>
        <Button onClick={handleTeacherLogin} variant="secondary" className="text-xl cursor-pointer">
          Teacher Login
        </Button>
      </div>
    </div>
  );
}
