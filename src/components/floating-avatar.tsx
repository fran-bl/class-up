"use client";

import { usePathname } from "next/navigation";
import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/login/actions";
import { toast } from "react-toastify";

export default function FloatingAvatar() {
    const pathname = usePathname();

    const handleSignOut = async () => {
        try {
            const result = await logout();
            if (!result.success) {
                toast.error("Logout failed: " + result.error)
            } else {
                toast.success("Logout successful!")
                if (result.redirectTo) {
                    window.location.href = result.redirectTo
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred: " + error)
        }
    }

    if (pathname === "/login") {
        return null;
    }

    return (
        <div className="fixed top-5 right-10 z-50 flex items-center gap-2 p-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="bg-transparent hover:bg-transparent w-10 h-10 rounded-full p-0 text-white cursor-pointer">
                        <CurrentUserAvatar />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-transparent border-none shadow-none">
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="bg-transparent hover:bg-transparent cursor-pointer grid grid-cols-1 justify-items-center">
                            <button onClick={handleSignOut} className="pb-2 px-4 border-b-2 border-primary font-medium">
                                Logout
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}