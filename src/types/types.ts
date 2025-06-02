export interface Class {
    id: string | undefined;
    teacher_id: string | undefined;
    name: string;
    description: string | undefined;
    created_at: string | undefined;
    active_assignments?: number;
}

export interface Homework {
    id: string | undefined;
    class_id: string | undefined;
    title: string;
    description: string | undefined;
    file_url: string | undefined;
    created_at: string | undefined;
    due_date: string | undefined;
    submitted?: boolean;
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

export interface HomeworkSubmission {
    id: string | undefined;
    homework_id: string | undefined;
    student_id: string | undefined;
    submitted_at: string;
    grade: number;
    file_url: string | undefined;
    homework?: {
        title: string;
    };
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon_url: string;
    type: "milestone" | "streak" | "event" | "one_time";
    condition_type: "xp_total" | "homework_count" | "challenge_win";
    condition_value: number;
    event_start: string | undefined;
    event_end: string | undefined;
    created_at: string;
    badges_progress?: {
        id: string;
        profile_id: string;
        badge_id: string;
        progress_value: number;
        updated_at: string;
    }
}