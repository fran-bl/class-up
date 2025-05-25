export interface Class {
    id: string | undefined;
    teacher_id: string | undefined;
    name: string;
    description: string | undefined;
    created_at: string | undefined;
}

export interface Homework {
    id: string | undefined;
    class_id: string | undefined;
    title: string;
    description: string | undefined;
    file_url: string | undefined;
    created_at: string | undefined;
    due_date: string | undefined;
}

export interface Challenge {
    id: string | undefined;
    target_class: string | undefined;
    created_by: string | undefined;
    title: string;
    description: string | undefined;
    type: "individual" | "class" | "weekly";
    condition_type: "xp_gain" | "homework_count" | "streak";
    target_value: number;
    progress: number;
    xp_reward: number;
    end_date: string | undefined;
    start_date: string | undefined;
    class_name?: string;
}

export interface ChallengeParticipant {
    challenge_id: string;
    profile_id: string;
    joined_at: string;
    profile: {
        id: string;
        username: string;
        xp: number;
        avatar_url: string | null;
        created_at: string;
    };
    contribution: number;
}