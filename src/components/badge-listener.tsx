"use client";

import { useBadgeToast } from "@/hooks/use-badge-toast";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import BadgeToast from "./badge-toast";


const supabase = createClient();

export default function BadgeListener() {
    const { badgeToastState, showBadgeToast, hideBadgeToast } = useBadgeToast();

    useEffect(() => {
        const subscription = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                console.warn("Error fetching user:", error);
                return;
            }

            const profileId = user.id;
            const channel = supabase
                .channel("badge-listener")
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "earned_badges",
                        filter: `profile_id=eq.${profileId}`,
                    },
                    async (payload) => {
                        const badgeId = payload.new.badge_id;

                        const { data: badge } = await supabase
                            .from("badges")
                            .select("*")
                            .eq("id", badgeId)
                            .single();

                        if (badge) {
                            showBadgeToast(`You earned a new badge: ${badge.name}!`, badge.icon_url, 5000);
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            }
        }

        subscription();
    }, []);

    return <BadgeToast
        icon_url={badgeToastState.iconUrl}
        message={badgeToastState.message}
        isVisible={badgeToastState.isVisible}
        onClose={hideBadgeToast}
    />;
}