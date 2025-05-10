export interface Class {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export interface Homework {
    id: string;
    class_id: string;
    title: string;
    description: string | null;
    file_url: string | null;
    created_at: string;
    due_date: string | null;
}